import { useState, useEffect } from "react"
import axios from "axios"
import { Moon, Sun, Send, Plus, Download, Trash2, Clock, Cookie } from "lucide-react"

function App() {
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("GET")
  const [headers, setHeaders] = useState("")
  const [body, setBody] = useState("")
  const [cookies, setCookies] = useState([{ name: "", value: "", domain: "", path: "" }])
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState("params")
  const [theme, setTheme] = useState("light")
  const [consoleOutput, setConsoleOutput] = useState([])

  useEffect(() => {
    const savedHistory = localStorage.getItem("requestHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [])

  const saveToHistory = (request) => {
    const updatedHistory = [request, ...history.slice(0, 9)]
    setHistory(updatedHistory)
    localStorage.setItem("requestHistory", JSON.stringify(updatedHistory))
  }
  const deleteHistoryItem = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem("requestHistory", JSON.stringify(updatedHistory));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponse(null)
    setConsoleOutput([])
    let parsedHeaders = {}
    let parsedBody = {}

    try {
      parsedHeaders = headers ? JSON.parse(headers) : {}
      parsedBody = body ? JSON.parse(body) : {}
    } catch (parseError) {
      setResponse({ error: "Headers and Body must be valid JSON objects" })
      setLoading(false)
      return
    }

    const cookieString = cookies
      .filter(cookie => cookie.name && cookie.value)
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ')

    if (cookieString) {
      parsedHeaders['Cookie'] = cookieString
    }

    const request = { url, method, headers: parsedHeaders, body: parsedBody }

    try {
      setConsoleOutput(prev => [...prev, { type: 'info', message: `Sending ${method} request to ${url}` }])
      const response = await axios.post("https://reqquest-backend.onrender.com/api/test", request)
      setResponse(response.data)
      setConsoleOutput(prev => [...prev, { type: 'success', message: `Response received with status ${response.status}` }])
      saveToHistory({ ...request, response: response.data, timestamp: new Date().toISOString() })
    } catch (error) {
      console.error("Request failed:", error)
      setResponse(error.response ? error.response.data : { error: error.message })
      setConsoleOutput(prev => [...prev, { type: 'error', message: `Request failed: ${error.message}` }])
      saveToHistory({ ...request, error: error.message, timestamp: new Date().toISOString() })
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setUrl("")
    setMethod("GET")
    setHeaders("")
    setBody("")
    setCookies([{ name: "", value: "", domain: "", path: "" }])
    setResponse(null)
    setConsoleOutput([])
  }

  const handleDownload = () => {
    if (!response) return
    const blob = new Blob([JSON.stringify(response, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "Response.json"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  
    // Apply theme class to the document's root element
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  

  const addCookie = () => {
    setCookies([...cookies, { name: "", value: "", domain: "", path: "" }])
  }

  const updateCookie = (index, field, value) => {
    const newCookies = [...cookies]
    newCookies[index][field] = value
    setCookies(newCookies)
  }

  const removeCookie = (index) => {
    const newCookies = cookies.filter((_, i) => i !== index)
    setCookies(newCookies)
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <img
            src="/src/logo.svg"
            alt="ReqQuest Logo"
            className="w-8 h-8 dark"
          />
          <h1 className="text-xl font-bold">ReqQuest</h1>
        </div>
        <button
          className="mb-4 px-4 py-2 rounded text-white font-medium transition-all duration-300 ease-in-out
                     bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                     shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]"
          onClick={handleClear}
        >
          <Plus className="inline-block mr-2 h-4 w-4" /> New Request
        </button>
        <div className="flex-grow overflow-auto">
          <h2 className="font-semibold mb-2">History</h2>
          {history.map((item, index) => (
            <div key={index} className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
              <div className="font-medium">{item.method} {item.url}</div>
              <div className="text-gray-500 dark:text-gray-400">{new Date(item.timestamp).toLocaleString()}</div>
              <button
      onClick={() => deleteHistoryItem(index)}
      className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded"
    >
      <Trash2 className="h-4 w-4" />
    </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-[100px] p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              placeholder="Enter request URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-[400px] p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded text-white font-medium transition-all duration-300 ease-in-out
                         bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600
                         shadow-[0_0_15px_rgba(52,211,153,0.5)] hover:shadow-[0_0_25px_rgba(52,211,153,0.7)]
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending
                </div>
              ) : (
                <>
                  <Send className="inline-block mr-2 h-4 w-4" /> Send
                </>
              )}
            </button>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'light' ?  (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
           
          </button>
        </header>

        {/* Request body */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
          <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {['Params', 'Headers', 'Body', 'Cookies'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 ${activeTab === tab.toLowerCase() ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-4">
              {activeTab === 'params' && (
                <p className="text-sm text-gray-500 dark:text-gray-400">Query params will be automatically extracted from the URL.</p>
              )}
              {activeTab === 'headers' && (
                <textarea
                  placeholder={'{"Content-Type": "application/json"}'}
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  rows={10}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
              )}
              {activeTab === 'body' && (
                <textarea
                  placeholder={'{"key": "value"}'}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
              )}
              {activeTab === 'cookies' && (
                <div className="space-y-4">
                  {cookies.map((cookie, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={cookie.name}
                        onChange={(e) => updateCookie(index, 'name', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={cookie.value}
                        onChange={(e) => updateCookie(index, 'value', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      />
                      <input
                        type="text"
                        placeholder="Domain"
                        value={cookie.domain}
                        onChange={(e) => updateCookie(index, 'domain', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      />
                      <input
                        type="text"
                        placeholder="Path"
                        value={cookie.path}
                        onChange={(e) => updateCookie(index, 'path', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                      />
                      <button
                        onClick={() => removeCookie(index)}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addCookie}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Plus className="inline-block mr-2 h-4 w-4" /> Add Cookie
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Response and Console */}
        <div className="h-1/3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden flex">
          {/* Response */}
          <div className="w-1/2 p-4 overflow-auto border-r border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Response</h3>
              {response && (
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 rounded text-white font-medium transition-all duration-300 ease-in-out
                             bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600
                                               shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:shadow-[0_0_25px_rgba(139,92,246,0.7)]"
                >
                  <Download className="inline-block mr-2 h-4 w-4" /> Download
                </button>
              )}
            </div>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm overflow-auto max-h-48">
              {response ? JSON.stringify(response, null, 2) : "No response yet."}
            </pre>
          </div>

          {/* Console Output */}
          <div className="w-1/2 p-4 overflow-auto">
            <h3 className="text-lg font-semibold mb-2">Console</h3>
            <ul className="space-y-2 text-sm">
              {consoleOutput.map((entry, index) => (
                <li
                  key={index}
                  className={`p-2 rounded ${
                    entry.type === "info"
                      ? "bg-blue-100 dark:bg-blue-900"
                      : entry.type === "success"
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  }`}
                >
                  {entry.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
