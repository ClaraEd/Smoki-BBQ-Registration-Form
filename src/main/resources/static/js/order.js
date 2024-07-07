let cartCount = 0;
let cartItems = [];

// Load cart from local storage
document.addEventListener("DOMContentLoaded", () => {
  const savedCart = localStorage.getItem("cartItems");
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
    updateCart();
  }

  // Call the function for lunch and dinner menus
  createMenuItems(lunchMenuItems, "lunch-menu");
  createMenuItems(dinnerMenuItems, "dinner-menu");

  // Add event listeners for the "Add to Cart" buttons in signature dishes
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".project-card");
      const alert = card.querySelector(".cart-alert");
      const itemName = card.querySelector(".food-name").innerText;
      const itemPrice = parseFloat(
        card.querySelector(".food-price").innerText.replace("$", "")
      );

      // Add item to cart with quantity 1 initially
      addToCart(itemName, itemPrice, 1);

      // Display the alert
      card.classList.add("show-alert");
      setTimeout(() => {
        card.classList.remove("show-alert");
      }, 2000); // Adjust the duration as needed
    });
  });
});

// Add item to cart function
function addToCart(name, price, quantity) {
  const existingItem = cartItems.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({ name, price, quantity });
  }
  updateCart();
}

// Update cart display
function updateCart() {
  // Update cart count based on total quantity
  cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.querySelector(".cart-count");
  cartCountElement.innerText = cartCount;
  cartCountElement.style.display = cartCount > 0 ? "inline-block" : "none";

  // Save cart to local storage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Update cart modal items
  const cartItemsList = document.getElementById("cart-items");
  cartItemsList.innerHTML = "";
  cartItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="cart-item-name">${item.name} - $${item.price.toFixed(2)} x ${
      item.quantity
    }</span>
      <div class="cart-item-quantity">
        <button onclick="changeQuantity(${index}, 1)">+</button>
        <button onclick="changeQuantity(${index}, -1)">-</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsList.appendChild(li);
  });

  // Display total price
  const totalPrice = calculateTotalPrice();
  const totalLi = document.createElement("li");
  totalLi.innerHTML = `<span class="cart-total">Total: $${totalPrice.toFixed(
    2
  )}</span>`;
  cartItemsList.appendChild(totalLi);

  // Show or hide the Clear Cart button based on cart items
  const clearCartButton = document.querySelector(".clear-cart-button");
  clearCartButton.style.display = cartCount > 0 ? "block" : "none";
}

// Calculate total price
function calculateTotalPrice() {
  return cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

// Toggle cart modal visibility
function toggleCart() {
  const cartModal = document.getElementById("cart-modal");
  cartModal.style.display =
    cartModal.style.display === "block" ? "none" : "block";
}

// Remove item from cart
function removeFromCart(index) {
  cartItems.splice(index, 1);
  updateCart();
}

// Add event listener to Order Now button
document.querySelector(".order-button").addEventListener("click", () => {
  document
    .querySelector(".menu-section")
    .scrollIntoView({ behavior: "smooth" });
});

// Change item quantity in cart
function changeQuantity(index, change) {
  cartItems[index].quantity += change;
  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1);
  }
  updateCart();
}

// Function to handle delivery options and address
function handleDelivery() {
  const deliveryCheckbox = document.getElementById("delivery-checkbox");
  const addressInput = document.getElementById("delivery-address");

  if (deliveryCheckbox.checked) {
    addressInput.style.display = "block";
  } else {
    addressInput.style.display = "none";
  }
}

// Adding event listener for delivery checkbox
document
  .getElementById("delivery-checkbox")
  .addEventListener("change", handleDelivery);

// Function to get cart summary with form validation
function getCartSummary() {
  const delivery = document.getElementById("delivery-checkbox").checked;
  const address = delivery
    ? document.getElementById("delivery-address").value
    : "N/A";
  const name = document.getElementById("customer-name").value.trim();
  const email = document.getElementById("customer-email").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();

  // Form validation
  if (!name || !email || !phone || (delivery && !address)) {
    alert("Please fill out all required fields.");
    return;
  }

  const cartSummary = {
    items: cartItems,
    total: calculateTotalPrice(),
    delivery,
    address,
    customer: {
      name,
      email,
      phone,
    },
  };

  console.log(cartSummary);
  // Here you can send this summary to your backend via an API call
  fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cartSummary),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      // You can show a success message to the user here
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Toggle clear cart confirmation modal visibility
function toggleClearCartModal() {
  const clearCartModal = document.getElementById("clear-cart-modal");
  clearCartModal.style.display =
    clearCartModal.style.display === "block" ? "none" : "block";
}

// Clear cart function with custom confirmation
function clearCart() {
  toggleClearCartModal();
}

// Confirm clear cart action
function confirmClearCart() {
  cartItems = [];
  updateCart();
  toggleClearCartModal();
}

// Show cart summary tooltip
function showCartSummary() {
  const cartSummaryTooltip = document.getElementById("cart-summary-tooltip");
  cartSummaryTooltip.innerHTML = "";

  if (cartItems.length === 0) {
    cartSummaryTooltip.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    const ul = document.createElement("ul");
    cartItems.forEach((item) => {
      const li = document.createElement("li");
      li.innerText = `${item.name} - $${item.price.toFixed(2)} x ${
        item.quantity
      }`;
      ul.appendChild(li);
    });
    cartSummaryTooltip.appendChild(ul);
  }

  cartSummaryTooltip.style.display = "block";
}

// Hide cart summary tooltip
function hideCartSummary() {
  const cartSummaryTooltip = document.getElementById("cart-summary-tooltip");
  cartSummaryTooltip.style.display = "none";
}

// Function to check if an element is in the viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Add event listener for scrolling animation
document.addEventListener("scroll", () => {
  const projectContainer = document.querySelector(".project-container");
  if (isElementInViewport(projectContainer)) {
    projectContainer.classList.add("scroll-animate");
    // Remove the animation class after it runs once
    setTimeout(() => {
      projectContainer.classList.remove("scroll-animate");
    }, 2000);
  }
});

const lunchMenuItems = [
  {
    name: "Perfect Smoked Pork Ribs",
    image: "/img/pork_ribs.jpg",
    price: 12.99,
  },
  {
    name: "Burnt Ends with Bourbon Sauce",
    image: "/img/burnt_ends.jpg",
    price: 13.99,
  },
  {
    name: "Apple-Glazed Barbecued Baby Back Ribs",
    image: "/img/baby_back_ribs.jpg",
    price: 14.99,
  },
  {
    name: "Robb Walsh's Texas Barbecue Brisket",
    image: "/img/brisket.jpg",
    price: 15.99,
  },
  {
    name: "Sticky Barbecued Beef Ribs",
    image: "/img/beef_ribs.jpg",
    price: 16.99,
  },
];

const dinnerMenuItems = [
  { name: "Smoked Brisket", image: "/img/smoked_brisket.jpg", price: 17.99 },
  {
    name: "Red Wine Barbecue Chicken",
    image: "/img/red_wine_chicken.jpg",
    price: 18.99,
  },
  {
    name: "Grilled Chicken with Sweet Mustard Barbecue Sauce",
    image: "/img/grilled_chicken.jpg",
    price: 19.99,
  },
  {
    name: "Barbecued Brisket and Burnt Ends",
    image: "/img/brisket_burnt_ends.jpg",
    price: 20.99,
  },
  {
    name: "Big Bob Gibson's Chicken with White Barbecue Sauce",
    image: "/img/gibson_chicken.jpg",
    price: 21.99,
  },
];

// Function to create menu items
function createMenuItems(menuItems, containerId) {
  const container = document.getElementById(containerId);
  const ul = container.querySelector(".menu-items");
  menuItems.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="menu-item-img" />
      <span>${item.name}</span>
      <button class="menu-item-plus" onclick="showItemDetails('${item.name}', ${item.price}, '${item.image}')">+</button>
    `;
    ul.appendChild(li);
  });
}

// Show menu item popup
function showItemDetails(name, price, image) {
  const popup = document.getElementById("menu-item-popup");
  popup.querySelector("img").src = image;
  popup.querySelector(".popup-title").innerText = name;
  popup.querySelector(".popup-price").innerText = `Price: $${price.toFixed(2)}`;
  popup.querySelector(".add-to-cart").onclick = () => {
    addToCart(name, price, 1);
    closeMenuItemPopup();
  };
  popup.style.display = "block";
}

// Close menu item popup
function closeMenuItemPopup() {
  document.getElementById("menu-item-popup").style.display = "none";
}

// Call the function for lunch and dinner menus
document.addEventListener("DOMContentLoaded", () => {
  createMenuItems(lunchMenuItems, "lunch-menu");
  createMenuItems(dinnerMenuItems, "dinner-menu");
});
