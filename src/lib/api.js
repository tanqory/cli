// src/lib/api.js
const axios = require('axios');
const config = require('./config');
const { error } = require('./utils');
const chalk = require('chalk');
const FormData = require('form-data');
const fs = require('fs');

// กำหนด Base URL ของ API
// เราจะใช้ URL จาก config เป็นหลัก แต่จะมีค่า default ให้
const API_BASE_URL = config.get('apiBaseUrl') || 'https://api.tanqory.com/api/v1';
const AUTH_API_URL = config.get('authApiUrl') || 'https://api-auth.tanqory.com/api/v1';
const STORAGE_API_URL = config.get('storageApiUrl') || 'https://api-storage.tanqory.com/api/v1';

class TanqoryAPI {
  constructor() {
    this.authAxiosInstance = axios.create({
      baseURL: AUTH_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.mainAxiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor สำหรับจัดการ Access Token
    this.mainAxiosInstance.interceptors.request.use(async (_config) => {
      const accessToken = config.get('accessToken');
      // ถ้าไม่มี Token หรือ Token กำลังจะหมดอายุ
      if (!accessToken || Date.now() > config.get('accessTokenExpiresAt')) {
        await this.refreshToken();
      }

      const latestAccessToken = config.get('accessToken');
      if (latestAccessToken) {
        _config.headers['Authorization'] = `Bearer ${latestAccessToken}`;
      }
      return _config;
    }, (err) => {
      return Promise.reject(err);
    });

    // Interceptor สำหรับแสดงผล Error
    this.mainAxiosInstance.interceptors.response.use(
      (response) => response,
      (err) => {
        if (err.response) {
          const { status, data } = err.response;
          console.log(data)
          error(`API Error: ${chalk.bold(status)} - ${data.message || data}`);
        } else if (err.request) {
          error('API Error: No response received from server.');
        } else {
          error(`API Error: ${err.message}`);
        }
        return Promise.reject(err);
      }
    );
  }

  async initiateDeviceAuth() {
    const response = await this.authAxiosInstance.post('/auth/device/initiate');
    return response.data.data;
  }

  async pollDeviceAuth(device_code) {
    const response = await this.authAxiosInstance.post('/auth/device/poll', {
      device_code: device_code,
    });
    return response.data.data;
  }

  async refreshToken() {
    const refreshToken = config.get('refreshToken');
    if (!refreshToken) {
      error('No refresh token available. Please log in again.');
      throw new Error('No refresh token.');
    }

    try {
      const response = await this.authAxiosInstance.post('/auth/token/refresh', {
        refresh_token: refreshToken,
      });
      const { access_token, refresh_token, expire } = response.data;
      config.set('accessToken', access_token);
      config.set('refreshToken', refresh_token);
      config.set('accessTokenExpiresAt', Date.now() + (expire * 1000));
      return access_token;
    } catch (err) {
      error('Failed to refresh token. Please log in again.');
      throw err;
    }
  }

  // ตัวอย่าง API calls ที่เกี่ยวข้องกับ Theme
  async getSites() {
    // API นี้ต้องใช้ accessToken ที่ได้จากการล็อกอิน
    const response = await this.mainAxiosInstance.get('/sites');
    return response.data;
  }

  async createTheme(storeName) {
    const response = await this.mainAxiosInstance.post(`/themestore/sites/${storeName}/themes/tanqory/add`, {});
    return response.data;
  }
  async getThemes(storeName) {
    const response = await this.mainAxiosInstance.get(`/stores/${storeName}/themes`);
    return response.data;
  }

  async getTheme(storeName, themeId) {
    const response = await this.mainAxiosInstance.get(`/stores/${storeName}/themes/${themeId}`);
    return response.data;
  }

  async uploadFile(storeName, themeId, zipFilePath) {
    // API นี้จะรับ filePath (relative path) และ content ของไฟล์
    const formData = new FormData();
    formData.append('zip', fs.createReadStream(zipFilePath));

    const response = await axios.post(
      `${STORAGE_API_URL}/storage/site/${storeName}/themes/${themeId}/download/zip`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  async downloadFile(storeName, themeId) {
    const response = await this.mainAxiosInstance.get(`${STORAGE_API_URL}/storage/site/${storeName}/themes/${themeId}/download/zip`, {
      responseType: 'arraybuffer'
    });
    return response.data;
  }

  async uploadThemeZip(storeName, themeId, zipFilePath) {
    // API นี้จะรับ filePath (relative path) และ content ของไฟล์
    const formData = new FormData();
    formData.append('zip', fs.createReadStream(zipFilePath));

    const response = await this.mainAxiosInstance.post(
      `${STORAGE_API_URL}/storage/site/${storeName}/themes/${themeId}/upload/zip`,
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    return response.data;
  }

  async downloadThemeZip(storeName, themeId) {
    const response = await this.mainAxiosInstance.get(`${STORAGE_API_URL}/storage/site/${storeName}/themes/${themeId}/download/zip`, {
      responseType: 'arraybuffer'
    });
    return response.data;
  }
}

module.exports = new TanqoryAPI();