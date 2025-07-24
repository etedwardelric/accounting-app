export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/overview") {
      return new Response(JSON.stringify({ totalExpense: 500, totalReserve: 200, totalBalance: -300 }));
    }
    return new Response("Not Found", { status: 404 });
  }
};