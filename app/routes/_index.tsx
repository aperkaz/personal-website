import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "New Remix App",
    name: "description",
    content: "Welcome to Remix!",
  };
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Intro page</h1>
      <div className="flex items-center space-x-4">
        <img
          className="w-10 h-10 rounded-full"
          src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          alt="Rounded avatar"
        />
        <img
          className="w-10 h-10 rounded"
          src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
          alt="Default avatar"
        />
      </div>
    </div>
  );
}
