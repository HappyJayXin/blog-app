document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector("[data-comment-toggle]");
  const commentForm = document.querySelector("[data-comment-form]");
  if (toggleButton && commentForm) {
    toggleButton.addEventListener("click", () => {
      const isHidden = commentForm.hasAttribute("hidden");
      if (isHidden) {
        commentForm.removeAttribute("hidden");
        const nameInput = commentForm.querySelector("input[name='name']");
        if (nameInput) {
          nameInput.focus();
        }
      } else {
        commentForm.setAttribute("hidden", "");
      }
    });
  }

  const likeButton = document.querySelector("[data-like-button]");
  const likeCount = document.querySelector("[data-like-count]");
  if (likeButton && likeCount) {
    likeButton.addEventListener("click", async () => {
      const imageId = likeButton.dataset.imageId;
      try {
        const response = await fetch(`/images/${imageId}/like`, {
          method: "POST",
          headers: { "Accept": "application/json" }
        });
        if (!response.ok) {
          throw new Error("request failed");
        }
        const result = await response.json();
        if (result && typeof result.likes === "number") {
          likeCount.textContent = result.likes;
        }
      } catch (error) {
        console.error("like error", error);
      }
    });
  }
});
