# Playwright Automation Portfolio

This repository contains a real-world automation testing framework built using **Playwright with JavaScript** to automate an e-commerce web application.

Website under test:  
https://automationexercise.com  

This project is created to demonstrate my skills in UI automation, test design, and framework development for QA roles.

---

##  Tech Stack
- Playwright  
- JavaScript (Node.js)  
- VS Code  
- GitHub  

---

##  Framework Design
This framework follows a modular and maintainable structure:

- Tests are written using Playwright Test Runner  
- Reusable page actions are separated  
- Supports parallel execution  
- Supports headless and headed mode  
- Generates HTML test reports  

---

##  Test Scenarios Covered

✔ User Signup  
✔ User Login  
✔ Product Search  
✔ Add Product to Cart  
✔ View Cart  
✔ Checkout Flow  
✔ Logout  

These scenarios represent real-world e-commerce workflows used in industry projects.

---

## Project Structure 

```
playwright-automation-portfolio
│
├── tests
│   ├── login.spec.js        # Login test cases
│   ├── signup.spec.js       # New user registration
│   ├── product.spec.js      # Search & product validation
│   └── cart.spec.js         # Add to cart & checkout
│
├── pages                   # Page Object Model
│   ├── LoginPage.js
│   ├── SignupPage.js
│   ├── ProductPage.js
│   └── CartPage.js
│
├── utils
│   └── testData.js          # Test data (email, password, etc)
│
├── playwright.config.js    # Playwright configuration
├── package.json            # Project dependencies
└── README.md               # Project documentation
```
## How to Run the Tests

1. Clone the repository  
git clone https://github.com/Shalinishaluuu/playwright-automation-portfolio.git  

2. Install dependencies  
npm install  

3. Run all tests  
npx playwright test  

4. View report  
npx playwright show-report



