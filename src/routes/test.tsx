import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  component: TestPage,
});

function TestPage() {
  return (
    <html>
      <head>
        <title>Test Page</title>
      </head>
      <body style={{ margin: 0, padding: "40px", fontFamily: "system-ui" }}>
        <h1>✅ Test Page Working!</h1>
        <p>If you can see this, the server is running correctly.</p>
        <p>The SSR error is caused by something in the main routes.</p>
        <hr />
        <h2>Debug Info:</h2>
        <ul>
          <li>Window exists: {typeof window !== "undefined" ? "YES (Client)" : "NO (Server)"}</li>
          <li>Time: {new Date().toISOString()}</li>
        </ul>
        <hr />
        <a href="/" style={{ color: "blue", textDecoration: "underline" }}>Go to Home</a>
      </body>
    </html>
  );
}
