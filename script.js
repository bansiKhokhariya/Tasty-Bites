// Highlight current page link
const links = document.querySelectorAll(".nav-link");
links.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

let allRecipes = [];
let filteredRecipes = [];
let currentIndex = 0;
const itemsPerPage = 4;

const recipeDiv = document.getElementById("recipes");
const searchInput = document.getElementById("searchInput");
const viewMoreBtn = document.getElementById("viewMoreBtn");
const viewLessBtn = document.getElementById("viewLessBtn");

// ================== INDEX PAGE (All Recipes) ==================
async function loadRecipes() {
  const res = await fetch("recipes.json");
  const data = await res.json();

  // Show categories
  const categoryDiv = document.getElementById("categories");
  if (categoryDiv) {
    data.categories.forEach(cat => {
      const c = document.createElement("a");
      c.href = `category.html?name=${cat.name}`;
      c.className =
        "block bg-white border-l-4 border-orange-500 rounded-md p-4 shadow hover:shadow-md transition";
      c.innerHTML = `<span class="font-bold text-gray-800">${cat.name}</span>`;
      categoryDiv.appendChild(c);
    });
  }

  // Flatten all recipes
  allRecipes = data.categories.flatMap(cat => cat.recipes);
  filteredRecipes = allRecipes;

  renderRecipes(true);
}

function renderRecipes(reset = false) {
  if (!recipeDiv) return;

  if (reset) {
    recipeDiv.innerHTML = "";
    currentIndex = 0;
  }

  const toShow = filteredRecipes.slice(currentIndex, currentIndex + itemsPerPage);
  toShow.forEach(r => {
    const card = `
      <div class="bg-white border border-orange-200 shadow-lg rounded-xl overflow-hidden">
        <img src="${r.img}" class="w-full h-80 object-cover" alt="${r.title}">
        <div class="p-4">
          <h3 class="font-bold text-lg mb-2">${r.title}</h3>
          <a href="${r.link}" class="text-orange-600 font-semibold">View Recipe →</a>
        </div>
      </div>`;
    recipeDiv.innerHTML += card;
  });

  currentIndex += itemsPerPage;

  if (viewMoreBtn) {
    viewMoreBtn.style.display =
      currentIndex >= filteredRecipes.length ? "none" : "inline-block";
  }
  if (viewLessBtn) {
    viewLessBtn.style.display =
      currentIndex > itemsPerPage ? "inline-block" : "none";
  }

  if (filteredRecipes.length === 0) {
    recipeDiv.innerHTML =
      "<p class='col-span-4 text-center text-2xl font-bold text-orange-600'>No recipes found.</p>";
  }
}

// Search filter
if (searchInput) {
  searchInput.addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    filteredRecipes = allRecipes.filter(r =>
      r.title.toLowerCase().includes(term)
    );
    renderRecipes(true);
  });
}

// Buttons
if (viewMoreBtn) {
  viewMoreBtn.addEventListener("click", () => renderRecipes());
}
if (viewLessBtn) {
  viewLessBtn.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    filteredRecipes = allRecipes;
    renderRecipes(true);
  });
}

// ================== CATEGORY PAGE ==================
async function loadCategory() {
  const params = new URLSearchParams(window.location.search);
  const categoryName = params.get("name");

  const res = await fetch("recipes.json");
  const data = await res.json();

  const category = data.categories.find(c => c.name === categoryName);
  if (!category) return;

  const titleEl = document.getElementById("categoryTitle");
  const recipeDiv = document.getElementById("categoryRecipes");

  if (titleEl) titleEl.innerText = categoryName + " Recipes";

  if (recipeDiv) {
    category.recipes.forEach(r => {
      recipeDiv.innerHTML += `
        <div class="bg-white border border-orange-200 shadow-lg rounded-xl overflow-hidden">
          <img src="${r.img}" class="w-full h-80 object-cover" alt="${r.title}">
          <div class="p-4">
            <h3 class="font-bold text-lg mb-2">${r.title}</h3>
            <a href="${r.link}" class="text-orange-600 font-semibold">View Recipe →</a>
          </div>
        </div>`;
    });
  }
}

// ================== INIT ==================
if (document.getElementById("recipes")) {
  loadRecipes(); // only on index page
}
if (document.getElementById("categoryRecipes")) {
  loadCategory(); // only on category page
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// navabar js
const btn = document.getElementById("menu-btn");
const menu = document.getElementById("mobile-menu");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});


//  ================== faq scripts ==================

const recipeName = window.location.pathname
  .split("/")
  .pop()
  .replace(".html", "");

fetch("../../faqs.json")
  .then(res => res.json())
  .then(data => {
    const faqs = data[recipeName] || [];

    let html = `
        <section class="container mx-auto py-12 px-4">
          <h2 class="text-3xl font-bold text-orange-600 mb-6 text-center">Frequently Asked Questions</h2>
          <div class="max-w-3xl mx-auto space-y-6 text-gray-700">`;

    faqs.forEach(faq => {
      html += `
          <div class="border-l-4 border-orange-500 pl-4">
            <h3 class="font-semibold text-gray-800">${faq.q}</h3>
            <p class="text-gray-600">${faq.a}</p>
          </div>`;
    });

    html += `</div></section>`;
    document.getElementById("faq-section").innerHTML = html;
  })
  .catch(err => console.error("FAQ load error:", err));

