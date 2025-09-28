-----

# GuruPath AI: The Intelligent JEE Study Planner 📚

An intelligent learning roadmap generator that creates personalized, hierarchical study paths for JEE (Joint Entrance Examination) topics, provides curated resources, and generates comprehensive PDF notes.

**Project Context:** This tool was developed as a proof-of-concept during **Samadhan 2.0**, a national-level hackathon organized by India's Ministry of Education and AICTE. The hackathon challenged innovators to build solutions ("Samadhan") for student-centric problems. This standalone application was originally designed as a core feature for a larger, full-stack learning platform but was completed in this form due to the time constraints of the event.

## Features ✨

  - **AI-Powered Hierarchical Roadmaps**: Creates detailed, nested learning paths in the style of roadmap.sh using the Google Gemini AI model.
  - **Interactive Visual Tree**: Displays the roadmap as a clickable, easy-to-read visual flowchart with adjustable height and orientation.
  - **Curated Learning Resources**: For each topic, it provides:
      - The top-viewed YouTube tutorial via the YouTube Data API.
      - A list of the top online articles from a live Google Search.
  - **AI-Generated PDF Study Notes**: Creates comprehensive, well-structured notes for any topic, formatted into a professional PDF document for offline study.

## Technology Stack 🛠️

  - **Frontend**: Streamlit
  - **AI Model**: Google Gemini 1.5 Pro
  - **APIs**:
      - Google Custom Search API
      - YouTube Data API v3
  - **PDF Generation**: ReportLab
  - **Visualization**: Mermaid diagrams via `streamlit-mermaid`

## Installation 📦

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd your-project-folder
    ```

2.  Create a virtual environment (recommended):

    ```bash
    python -m venv venv
    venv\Scripts\activate  # On Windows
    # source venv/bin/activate  # On Mac/Linux
    ```

3.  Install dependencies from `requirements.txt`:

    ```bash
    pip install -r requirements.txt
    ```

4.  Set up your API keys:

      - Create a file at `.streamlit/secrets.toml`
      - Add your three required keys to this file.

## API Keys Required 🔑

1.  **Google Gemini API Key**:

      - Get it from [Google AI Studio](https://aistudio.google.com/app/apikey).
      - Ensure it is linked to a Google Cloud project with **billing enabled** and the **Vertex AI API** activated.

2.  **Google Cloud API Key** (for YouTube and Custom Search):

      - Get it from the [Google Cloud Console](https://console.cloud.google.com/).
      - In your project, enable the **YouTube Data API v3** and the **Custom Search API**.

3.  **Programmable Search Engine ID**:

      - Create a search engine at the [Programmable Search Engine](https://programmablesearchengine.google.com/controlpanel/all) website.
      - Configure it to **"Search the entire web"** and copy the Search Engine ID.

Your final `.streamlit/secrets.toml` file should look like this:

```toml
GEMINI_API_KEY = "your-gemini-api-key"
YOUTUBE_API_KEY = "your-google-cloud-api-key"
SEARCH_ENGINE_ID = "your-search-engine-id"
```

## Usage 🚀

1.  Run the application:

    ```bash
    streamlit run app.py
    ```

2.  Enter any JEE topic (e.g., "Fluid Mechanics," "Calculus").

3.  Click "Generate My Study Roadmap."

4.  Click on any sub-topic in the interactive list to get curated resources.

## Dependencies 📚

All required Python libraries are listed in the `requirements.txt` file.

## Troubleshooting 🔧

  - **API Errors (`400`, `404`)**: This is the most common issue. Double-check that all three keys in your `secrets.toml` file are correct and that the necessary APIs are enabled in your Google Cloud project. Ensure billing is active for the project linked to your Gemini key.
  - **Roadmap Visibility**: If the visual tree is too small, you can adjust the `height` parameter in the `st_mermaid()` function call in `app.py`.

## License 📄

This project is open source and available under the MIT License.

-----

**Developed for the ❤️ of learning during the Samadhan 2.0 Hackathon**
