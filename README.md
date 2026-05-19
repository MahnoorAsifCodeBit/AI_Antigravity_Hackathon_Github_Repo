# Team: Innovix 

# ServAI:  AI Service Orchestrator for Informal Economy

## Challenge 2: Agentic AI System

ServAI is an AI-powered service orchestration system built for the informal economy. The platform automates the complete lifecycle of a service request from user intent understanding to provider matching, booking simulation, and follow-up automation.

The system was developed as part of the hackathon challenge focused on building an Agentic AI workflow using Google Antigravity.


<img width="263" height="497" alt="image" src="https://github.com/user-attachments/assets/d2daee75-1dd8-4f2c-83a0-42d45aecb198" />

Secure Connection Established

<img width="1355" height="633" alt="image" src="https://github.com/user-attachments/assets/06b6659f-0870-41a9-89f2-aae399af017c" />

Security Warning Detected 

<img width="1358" height="628" alt="image" src="https://github.com/user-attachments/assets/414cdb12-17e3-486e-b450-94c507e65ef2" />


# Problem Statement

Informal service providers such as:

* plumbers
* electricians
* AC technicians
* beauticians
* tutors
* home service workers

mostly operate through:

* WhatsApp
* phone calls
* referrals

This creates:

* inefficient service discovery
* poor customer experience
* missed business opportunities
* lack of automation

ServAI solves this problem by introducing an AI-driven orchestration workflow capable of understanding user requests, discovering providers, ranking the best option, simulating bookings, and automating follow-ups.

---

# Project Goals

The goal of ServAI is to:

* automate service booking workflows
* support multilingual inputs
* simulate intelligent agentic orchestration
* provide provider recommendations
* demonstrate autonomous decision-making
* generate traceable execution logs
* simulate booking confirmation and reminders

---

# Key Features

## Multilingual Input Support

ServAI supports:

* English
* Urdu
* Roman Urdu


### Example Inputs

```text
Mujhe kal DHA Karachi mein plumber chahiye
Need electrician in Clifton tomorrow
Mujhe G-13 mein AC technician chahiye
```
---

# Agentic Workflow

The system demonstrates a complete multi-agent workflow:

```text
User Request
↓
Intent Understanding Agent
↓
Provider Discovery Agent
↓
Ranking Agent
↓
Booking Agent
↓
Follow-Up Agent
↓
Logging Agent
```

<img width="518" height="266" alt="image" src="https://github.com/user-attachments/assets/91358d5a-1c79-4325-871e-933a270b989b" />

<img width="306" height="53" alt="image" src="https://github.com/user-attachments/assets/b5bf399a-cdf4-43ef-84e4-848c833bf0fc" />

<img width="543" height="268" alt="image" src="https://github.com/user-attachments/assets/ae096ce7-ec87-48ae-8bd3-22931a5d77c4" />

<img width="840" height="168" alt="image" src="https://github.com/user-attachments/assets/a2cbd161-ff47-4b6b-8920-c0715e3c77bd" />

<img width="225" height="170" alt="image" src="https://github.com/user-attachments/assets/7b67e901-3df9-436e-8c02-3d1d6c970822" />

<img width="502" height="364" alt="image" src="https://github.com/user-attachments/assets/e9c26951-4e13-42ec-83b8-1093ca00d212" />

---

# Agents Developed

## 1. Intent Understanding Agent

### Responsibilities

* process natural language requests
* extract service type
* extract location
* extract requested time

### Example Output

```json
{
  "service": "plumber",
  "location": "DHA Karachi",
  "time": "tomorrow"
}
```

---

## 2. Provider Discovery Agent

### Responsibilities

* identify matching providers
* filter providers based on service category
* simulate nearby provider discovery

### Mock Dataset Includes

* Ali Plumbing Services
* Fast Electricians
* Cool Air AC Services

---

## 3. Ranking Agent

### Responsibilities

* rank providers using:

  * ratings
  * distance
  * availability

### Selection Logic

* highest rating preferred
* nearest provider preferred
* available providers prioritized

---

## 4. Booking Agent

### Responsibilities

* simulate booking confirmation
* generate booking ID
* assign provider
* confirm appointment scheduling

### Example

```text
Booking Confirmed
Booking ID: BK102
```

---

## 5. Follow-Up Agent

### Responsibilities

* simulate reminder scheduling
* simulate service status updates
* simulate completion confirmation

### Example

```text
Reminder scheduled 1 hour before appointment
```

---

## 6. Logging Agent

### Responsibilities

* generate workflow logs
* track execution steps
* explain reasoning
* demonstrate orchestration flow

### Example Logs

```text
[Intent Agent] Request understood
[Discovery Agent] Providers matched
[Ranking Agent] Best provider selected
[Booking Agent] Booking created
[Follow-Up Agent] Reminder scheduled
```

---

# System Architecture

<img width="1440" height="2160" alt="architecture" src="https://github.com/user-attachments/assets/cc6760b5-0f11-41de-b03f-b6860505d623" />


```

---

# Technologies Used

## Frontend / Prototype

* Streamlit
* Python
* Google Colab

## AI & Orchestration

* Google Antigravity
* Multi-agent orchestration workflow
* Agent reasoning pipeline

## APIs / AI Services

* Google Gemini API
* Google AI SDK
* ngrok
* pyngrok

---

# Google Antigravity Usage

Google Antigravity was used as the central orchestration layer of the project.

Antigravity was responsible for:

* multi-agent workflow orchestration
* reasoning pipeline execution
* workflow planning
* task coordination
* execution trace generation
* logging and decision explanations

The Antigravity workspace simulated interactions between:

* Intent Agent
* Discovery Agent
* Ranking Agent
* Booking Agent
* Follow-Up Agent
* Logging Agent

---

# Prototype Implementation

The working prototype was developed using Streamlit and Python.

### Features Implemented

* user input interface
* provider recommendation
* booking simulation
* reasoning display
* execution logs
* follow-up simulation

The application was executed in Google Colab and exposed using ngrok.

---

# Mock Provider Dataset

```python
providers = [
    {
        "name": "Ali Plumbing Services",
        "service": "plumber",
        "location": "DHA Karachi",
        "rating": 4.8,
        "distance": 1.2,
        "available": True
    },
    {
        "name": "Fast Electricians",
        "service": "electrician",
        "location": "Clifton Karachi",
        "rating": 4.5,
        "distance": 2.5,
        "available": True
    },
    {
        "name": "Cool Air AC Services",
        "service": "ac technician",
        "location": "G-13 Islamabad",
        "rating": 4.9,
        "distance": 1.8,
        "available": True
    }
]
```

---

# Workflow Example

## User Request

```text
Mujhe kal G-13 mein AC technician chahiye
```

## Intent Extraction

```text
Service: AC Technician
Location: G-13 Islamabad
Time: Tomorrow
```

## Provider Recommendation

```text
Cool Air AC Services
Rating: 4.9
Distance: 1.8 km
```

## Reasoning

```text
Selected because:
- Highest rating
- Closest provider
- Available tomorrow
```

## Booking Simulation

```text
Booking Confirmed
Booking ID: BK102
```

## Follow-Up

```text
Reminder scheduled 1 hour before appointment
```

---

# Innovation

ServAI introduces agentic automation into the informal service economy.

### Key Innovations

* multilingual service understanding
* AI orchestration workflow
* autonomous decision pipeline
* provider ranking reasoning
* workflow trace generation
* lightweight deployment approach


---


---


# Demo Deliverables

The project submission includes:

* working Streamlit prototype
* Google Antigravity orchestration workspace
* demo video
* Antigravity traces and logs
* architecture documentation
* GitHub repository

---

# Conclusion

ServAI demonstrates how Agentic AI systems can modernize the informal economy by automating service discovery, provider matching, booking workflows, and follow-up interactions.

By combining:

* Streamlit for rapid prototyping
* Google Antigravity for orchestration
* multi-agent reasoning workflows

ServAI provides a scalable foundation for intelligent service automation systems.

---

# Team Project

## Project Name

ServAI — AI Service Orchestrator

## Built For

Challenge 2 — AI Service Orchestrator for Informal Economy
