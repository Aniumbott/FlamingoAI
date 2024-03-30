async function getWorkspace(id: String) {
  console.log("collecting current workspace");
  const data = await fetch(`/api/workspace/?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  return response;
}

async function updateWorkspace(id: String, body: any) {
  const data = await fetch("/api/workspace", {
    method: "PUT",
    body: JSON.stringify({ id, ...body }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await data.json();
  return response;
}

export { getWorkspace, updateWorkspace };
