import Dashboard from "./dashboard";

const getItem = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:4000/items/${id}`);
    if (!response.ok) {
      throw new Error(`Error: Failed to fetch item ${id}`);
    }
    const item = await response.json();
    return {
      success: true,
      data: item,
    };
  } catch (err: Error | any) {
    console.error(err);
    return {
      success: false,
      error: err.message,
    };
  }
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const item = await getItem(id);

  return (
    <div>
      {item.success ? (
        // this page.tsx file is a server component, so data must be passed down to client component as props
        <div>
          <Dashboard item={item.data} />
        </div>
      ) : (
        <div>{item.error}</div>
      )}
    </div>
  );
};

export default Page;
