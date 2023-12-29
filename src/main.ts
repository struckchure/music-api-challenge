import { app } from "./app";

const PORT = process.env.PORT || 3000;

function main() {
  app.listen(PORT, () => {
    console.info(`app listening on port ${PORT}`);
  });
}

main();
