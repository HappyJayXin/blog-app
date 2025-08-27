async function loadPosts() {
  const res = await fetch('http://localhost:3000/api/posts');
  const posts = await res.json();

  const container = document.getElementById('posts');
  container.innerHTML = '';

  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
    container.appendChild(div);
  });
}

loadPosts();