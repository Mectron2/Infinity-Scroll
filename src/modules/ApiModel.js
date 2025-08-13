export default class ApiModel {
    static async fetchPosts(url, limit = 10, start = 0) {
        const res = await fetch(`${url}?_limit=${limit}&_start=${start}`);
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        return res.json();
    }
}