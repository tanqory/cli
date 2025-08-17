# @tanqory/cli

**`@tanqory/cli`** is a command-line interface tool designed to help developers manage and build themes for the Tanqory platform easily and efficiently.

-----

## Installation

To ensure the CLI works correctly, please make sure you have the latest version of Node.js installed.

You can install the CLI by running the following command in your terminal:

```bash
npm install @tanqory/cli
```

-----

## CLI Commands

The core commands of `@tanqory/cli` are divided into two main categories: account management and theme management.

### 🔑 Account Management

| Command | Description |
| :--- | :--- |
| **`tanqory login`** | Initiates the login process to connect the CLI to your Tanqory account. |
| **`tanqory logout`** | Logs you out of your Tanqory account and removes the saved authentication tokens. |

-----

### 🎨 Theme Management

These commands are used in the format `tanqory theme <command>`.

| Command | Description |
| :--- | :--- |
| **`tanqory theme new <project-name>`** | Creates a new theme project. It prompts you to select a **Store** and an existing **Theme** to use as a template. |
| **`tanqory theme dev`** | Starts a **local development server** with hot-reloading. The CLI automatically uploads file changes as you save, giving you real-time updates. |
| **`tanqory theme push`** | Uploads the entire theme from your local project to the selected Store. It zips the project folder and sends it in a single request. |
| **`tanqory theme pull`** | Downloads the latest version of the theme from the Store to your local machine. It downloads the theme as a `.zip` file and automatically extracts it. |

-----

## Usage Example (Workflow)

Here is a typical workflow for developing a theme using `@tanqory/cli`:

1.  **Log in to your account**

    ```bash
    tanqory login
    ```

2.  **Create a new theme project**

    ```bash
    tanqory theme new my-new-theme
    ```

    The CLI will prompt you to select your desired Store and Theme.

3.  **Start developing your theme**

    ```bash
    cd my-new-theme
    tanqory theme dev
    ```

    Run the local server to see your changes live.

4.  **Upload your code when finished**

    ```bash
    tanqory theme push
    ```

    This uploads all your theme's code to the Store.