import FileSystemView from "@/components/filesystem";

export default async function Home() {
  const res = await fetch("http://localhost/articles/folders", {
    cache: 'no-store' 
  });
  const data = await res.json();

  return (
    <>
      <FileSystemView data={data} />
    </>
  )
}
