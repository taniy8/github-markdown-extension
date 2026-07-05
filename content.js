function injectButtons() {
  const textareas = document.querySelectorAll(
    'textarea.js-comment-field, textarea[name="pull_request[body]"], textarea[name="issue[body]"], textarea[name="comment[body]"], textarea[name="commit_comment[body]"], textarea[name="pull_request_review[body]"], #pull_request_body, #issue_body'
  );

  textareas.forEach((textarea) => {
    const existingId = textarea.dataset.formatterInjected;
    if (existingId) return;

    textarea.dataset.formatterInjected = "true";

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      margin-top: 8px;
      align-items: center;
    `;

    function createBtn(text, borderColor, bgColor, textColor) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = text;
      btn.style.cssText = `
        font-size: 12px;
        padding: 4px 12px;
        border-radius: 6px;
        border: 1px solid ${borderColor};
        background-color: ${bgColor};
        color: ${textColor};
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-weight: 500;
        transition: all 0.15s ease;
      `;
      return btn;
    }

    const formatBtn = createBtn("✦ Format", "#30363d", "#21262d", "#8b949e");

    formatBtn.addEventListener("mouseenter", () => {
      formatBtn.style.borderColor = "#8b949e";
      formatBtn.style.color = "#e6edf3";
    });
    formatBtn.addEventListener("mouseleave", () => {
      formatBtn.style.borderColor = "#30363d";
      formatBtn.style.color = "#8b949e";
    });

    formatBtn.addEventListener("click", () => {
      const raw = textarea.value;
      if (!raw.trim()) return;

      const formatted = formatText(raw);
      textarea.value = formatted;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.dispatchEvent(new Event("change", { bubbles: true }));

      formatBtn.textContent = "✓ Formatted";
      formatBtn.style.borderColor = "#2ea043";
      formatBtn.style.color = "#3fb950";

      setTimeout(() => {
        formatBtn.textContent = "✦ Format";
        formatBtn.style.borderColor = "#30363d";
        formatBtn.style.color = "#8b949e";
      }, 2000);
    });

    const aiBtn = createBtn("✦ Format with AI", "#388bfd", "#1c2d4a", "#58a6ff");

    aiBtn.addEventListener("mouseenter", () => {
      aiBtn.style.backgroundColor = "#388bfd";
      aiBtn.style.color = "#fff";
    });
    aiBtn.addEventListener("mouseleave", () => {
      aiBtn.style.backgroundColor = "#1c2d4a";
      aiBtn.style.color = "#58a6ff";
    });

    aiBtn.addEventListener("click", async () => {
      const raw = textarea.value;
      if (!raw.trim()) return;

      const formatted = formatText(raw);

      aiBtn.textContent = "✦ Enhancing...";
      aiBtn.style.opacity = "0.7";
      aiBtn.disabled = true;
      formatBtn.disabled = true;

      try {
        const res = await fetch("https://github-markdown-formatter.vercel.app/api/enhance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: formatted }),
        });

        const data = await res.json();

        if (data.result) {
          textarea.value = data.result;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          textarea.dispatchEvent(new Event("change", { bubbles: true }));

          aiBtn.textContent = "✓ AI Enhanced";
          aiBtn.style.borderColor = "#2ea043";
          aiBtn.style.backgroundColor = "#1a4428";
          aiBtn.style.color = "#3fb950";
          aiBtn.style.opacity = "1";
        } else {
          throw new Error("No result");
        }
      } catch (err) {
        textarea.value = formatted;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));

        aiBtn.textContent = "⚠ AI failed — used basic";
        aiBtn.style.borderColor = "#f85149";
        aiBtn.style.backgroundColor = "#2d1a1a";
        aiBtn.style.color = "#f85149";
        aiBtn.style.opacity = "1";
      } finally {
        formatBtn.disabled = false;
        aiBtn.disabled = false;

        setTimeout(() => {
          aiBtn.textContent = "✦ Format with AI";
          aiBtn.style.borderColor = "#388bfd";
          aiBtn.style.backgroundColor = "#1c2d4a";
          aiBtn.style.color = "#58a6ff";
        }, 3000);
      }
    });

    wrapper.appendChild(formatBtn);
    wrapper.appendChild(aiBtn);

    const formContainer = textarea.closest(".js-previewable-comment-form, .comment-form-contents, .upload-enabled");
    if (formContainer) {
      formContainer.insertBefore(wrapper, formContainer.firstChild);
    } else {
      textarea.parentNode.insertBefore(wrapper, textarea);
    }
  });
}

// Run on page load
injectButtons();

// Watch for GitHub SPA navigation and dynamic comment forms
const observer = new MutationObserver(() => {
  injectButtons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});