# ReqQuest

![ReqQuest Logo](<img src="https://www.svgrepo.com/show/367180/req.svg" alt="ReqQuest Logo" width="100" />) 
### Your Ultimate Companion for a Seamless API Testing Journey

ReqQuest is a user-friendly API testing tool that lets you send requests, view responses in JSON format, and download them for further analysis. No sign-up is required, and you can start testing APIs instantly for free!

---

## 🌟 Features

- **Supports All Major HTTP Methods**: GET, POST, PUT, DELETE.
- **Customizable Headers and Body**: Define request headers and payload in JSON format.
- **Response Viewer**: View response data in a collapsible, readable JSON format.
- **Downloadable Response**: Easily save your API response as a JSON file.
- **Responsive Design**: Works seamlessly across devices.
- **Free to Use**: No credit card or registration required.

---

## 🛠️ Tech Stack

- **Frontend**: React, Bootstrap
- **Backend**: Axios for HTTP requests
- **Deployment**: Render (for backend deployment)
  
---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed.
- An IDE or text editor (e.g., VS Code).

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/blackXploit-404/ReqQuest.git
   cd ReqQuest
   ```

2. **Install Dependencies for Backend**
   ```bash
   cd ReqQuest-Backend
   npm i
   ```

3. **Run the App Locally**
   ```bash
   node index.js
   ```
   The app should now be running on `http://localhost:5000`.
   
4. **Install Dependencies for Backend**
   ```bash
   cd ReqQuest-Frontend
   npm i
   
   ```

5. **Run the App Locally**
   ```bash
   npm start
   ```
   The app should now be running on `http://localhost:3000`.

---

## 🔧 Usage

1. Enter the API URL.
2. Choose the HTTP method.
3. (Optional) Add Headers and Body in JSON format.
4. Click **Send Request** to fetch the API response.
5. View the response in the JSON viewer and download it if needed.

---

## 📂 Project Structure

- **`src/App.js`**: Main component handling form input, request submission, and response display.
- **`src/assets/logo.svg`**: Logo used in the header.
- **`src/App.css`**: Custom styling for components.
  
---

## 🐛 Troubleshooting

- **Invalid JSON Error**: Ensure headers and body fields have valid JSON format (e.g., `{"key": "value"}`).
- **CORS Issues**: If testing on certain APIs, you may encounter CORS errors depending on their configuration.

---

## 👥 Contributing

Feel free to fork the repository and submit pull requests for new features or improvements. Contributions are welcome!

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

For any questions or feedback, please reach out to **[Surajit Sen](https://github.com/blackXploit-404)**.

Happy testing with **ReqQuest**! 🛠️
