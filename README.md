# create-starboy

A simple CLI to scaffold new projects using a predefined template. It also includes a development mode to auto-restart the server on file changes.

## 📦 What does it do?

This CLI tool helps you quickly bootstrap a new project from a template folder. It:

* Prompts you for a project name (or takes it from command line)
* Creates a new folder with that name (unless `.` is passed to use current dir)
* Copies template files into the folder
* Replaces `{{projectName}}` placeholders in `README.md` and `package.json`
* Supports a `dev` command to run a file watcher and auto-restart your server

---

## 🛠️ Installation (Globally)

```bash
npm install -g create-starboy
```

Or using pnpm:

```bash
pnpm add -g create-starboy
```

---

## 🚀 Usage

### 1. Create a new project

```bash
npm create starboy
```

or with pnpm:

```bash
pnpm create starboy
```

Then follow the prompt to name your project.

### 2. Create a project in the current folder

```bash
npm create starboy .
```

or

```bash
pnpm create starboy .
```

This will use the current working directory instead of making a new one.

### 3. Start the dev mode

Once your project is created, go into the folder and run:

```bash
pnpm dev
```

Or via npm:

```bash
npm run dev
```

This starts the `dev.js` script, which:

* Watches your project files (ignores `node_modules`, `.git`, `dist`)
* Restarts the server (at `src/index.js`) whenever a file changes


---

## 📌 Notes

* If the target folder already exists, it will exit with an error.
* Automatically adds progress bar while creating files.
* Works smoothly with both `npm` and `pnpm`.

---

## 🔗 GitHub

Check out the source code here:
https://github.com/fazalkadivar21/starboy