import app from "./app";
import { PORT } from "./config/envVars";

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
