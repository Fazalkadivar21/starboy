export const greetHandler = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome!</title>
      <style>
        body {
          background: linear-gradient(135deg, #667eea, #764ba2);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        h1 {
          font-size: 4rem;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
          animation: fadeIn 2s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <h1>Welcome to starboy CLI Project!</h1>
    </body>
    </html>
  `);
};
