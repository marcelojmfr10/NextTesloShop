import { titleFont } from "../config/fonts";

export default function Home() {
  return (
    <div>
      <h1>hola mundo</h1>
      <h1 className={`${titleFont.className} font-bold`}>hola mundo</h1>
    </div>
  );
}
