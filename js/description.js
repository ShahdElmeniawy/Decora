document.addEventListener("DOMContentLoaded", function () {
    const backBtn = document.getElementById("backBtn");

    if (backBtn) {
        backBtn.addEventListener("click", function () {
            window.location.href = "store.html";
        });
    }


    let curProduct = JSON.parse(localStorage.getItem("curProduct"));

    document.getElementById("productImg").src = curProduct.product.image;
    document.getElementById("productTitle").innerHTML = curProduct.product.name;
    document.getElementById("productPrice").innerHTML = curProduct.product.price + " EGP";
    document.getElementById("productCategory").innerHTML = curProduct.product.category;
    document.getElementById("productDescription").innerHTML = curProduct.product.description;

    document.getElementById("addToCart").addEventListener("click", () => {
        const reqget = new XMLHttpRequest;
        reqget.open('GET', `http://localhost:3000/users?email=${curUser.email}`);
        reqget.send();
        reqget.addEventListener("readystatechange", function () {
            if (reqget.readyState === 4) {
                if (reqget.status == 200) {
                    let myUserData = JSON.parse(reqget.response);
                    let newOrders;
                    let allOrders = myUserData[0].orders;
                    if (myUserData[0].cart.length == 0) {
                        newOrders = {
                            status: "pending",
                            createdAt: new Date().toString(),
                            items: [
                                {
                                    productId: curProduct.product.id,
                                    qty: 1,
                                    unitPrice: curProduct.product.price,
                                    lineTotal: curProduct.product.price
                                }
                            ],
                            subtotal: curProduct.product.price,
                            tax: curProduct.product.price * 0.1,
                            grandTotal: curProduct.product.price + curProduct.product.price * 0.1,
                            currency: "EGP"
                        }
                        allOrders.push(newOrders);
                    } else {
                        let newitem;
                        let checkerItem = true;
                        let subPrice = myUserData[0].orders.at(-1).subtotal;
                        subPrice += curProduct.product.price;
                        myUserData[0].orders.at(-1).items.forEach(proEle => {
                            if (proEle.productId == curProduct.product.id) {
                                proEle.qty += 1;
                                proEle.lineTotal += curProduct.product.price;
                                checkerItem = false
                            }
                        });
                        if (checkerItem) {
                            newitem = {
                                productId: curProduct.product.id,
                                qty: 1,
                                unitPrice: curProduct.product.price,
                                lineTotal: curProduct.product.price
                            }
                            myUserData[0].orders.at(-1).items.push(newitem);

                        }

                        newOrders = {
                            status: "pending",
                            createdAt: new Date().toString(),
                            items: myUserData[0].orders.at(-1).items,
                            subtotal: subPrice,
                            tax: subPrice * 0.1,
                            grandTotal: subPrice + subPrice * 0.1,
                            currency: "EGP"
                        }
                    }
                    let newCart = myUserData[0].cart;
                    newCart.push(curProduct.product.id);
                    let updatedUser = {
                        "id": myUserData[0].id,
                        "fristName": myUserData[0].fristName,
                        "lastName": myUserData[0].lastName,
                        "email": myUserData[0].email,
                        "password": myUserData[0].password,
                        "role": "user",
                        "cart": newCart,
                        "orders": myUserData[0].orders,
                        "review": myUserData[0].review
                    };
                    const reqput = new XMLHttpRequest;
                    reqput.open('PUT', `http://localhost:3000/users/${myUserData[0].id}`);
                    reqput.setRequestHeader("Content-Type", "application/json");
                    reqput.send(JSON.stringify(updatedUser));
                }
            }
        });
        const toastE1 = document.querySelector('.toast');
        const toast = new bootstrap.Toast(toastE1);
        console.log(toastE1);
        toast.show();
    });


    function generateStars(rating) {
        const fullStar = '<i class="bi bi-star-fill text-warning"></i>';
        const halfStar = '<i class="bi bi-star-half text-warning"></i>';
        const emptyStar = '<i class="bi bi-star text-warning"></i>';

        let starsHTML = "";
        let fullCount = Math.floor(rating);
        let hasHalf = rating % 1 !== 0;
        for (let i = 0; i < fullCount; i++) starsHTML += fullStar;
        if (hasHalf) starsHTML += halfStar;
        let emptyCount = 5 - fullCount - (hasHalf ? 1 : 0);
        for (let i = 0; i < emptyCount; i++) starsHTML += emptyStar;
        return starsHTML;
    }

    document.getElementById("setStars").innerHTML = generateStars(curProduct.product.rating);


    const reviewContainer = document.getElementById('reviewListContainer');
    const form = document.getElementById('reviewForm');
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    const nameInput = document.getElementById('reviewerName');
    const commentInput = document.getElementById('reviewComment');
    const ratingError = document.getElementById('ratingError');
    const commentError = document.getElementById('commentError');
    const globalReviewCount = document.getElementById('globalReviewCount');

    // helper: format current date as YYYY-MM-DD
    function getTodayDate() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function renderReviews() {
        let html = '';
        let totalReviews = 0;

        const reqUser = new XMLHttpRequest();
        reqUser.open('GET', 'http://localhost:3000/users');
        reqUser.send();

        reqUser.addEventListener("readystatechange", function () {

            if (reqUser.readyState === 4 && reqUser.status === 200) {

                let UsersData = JSON.parse(reqUser.response);

                UsersData.forEach(user => {

                    if (user.review && user.review.length > 0) {

                        user.review.forEach(ele => {

                            if (ele.productId == curProduct.product.id) {

                                totalReviews++;

                                html += `
                                <div class="review-item">
                                    <div class="review-header">
                                        <span class="review-author">
                                            ${escapeHtml(user.fristName + " " + user.lastName) || 'Anonymous'}
                                        </span>
                                        <span class="review-date">
                                            ${escapeHtml(ele.date)}
                                        </span>
                                        <div class="review-stars">
                                            ${generateStars(ele.rate)}
                                        </div>
                                    </div>
                                    <div class="review-comment">
                                        ${escapeHtml(ele.comment).replace(/\n/g, '<br>')}
                                    </div>
                                </div>
                            `;
                            }
                        });
                    }
                });
                reviewContainer.innerHTML = html || `
                <div style="text-align:center; color:#7f8fa4; padding:2rem;">
                    No reviews yet. Be the first to write one!
                </div>
            `;

                globalReviewCount.innerText =
                    `based on ${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'}`;
            }
        });
    }

    function escapeHtml(unsafe) {
        if (!unsafe) return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function validateForm() {
        let isValid = true;
        const selectedRating = document.querySelector('input[name="rating"]:checked');
        if (!selectedRating) {
            ratingError.innerText = 'Please select a star rating.';
            isValid = false;
        } else {
            ratingError.innerText = '';
        }
        const comment = commentInput.value.trim();
        if (!comment) {
            commentError.innerText = 'Comment cannot be empty.';
            isValid = false;
        } else if (comment.length > 500) {
            commentError.innerText = 'Comment is too long (max 500 characters).';
            isValid = false;
        } else {
            commentError.innerText = '';
        }
        return isValid;
    }


    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) return;

        const selectedRating = document.querySelector('input[name="rating"]:checked');
        const ratingValue = parseInt(selectedRating.value, 10);
        const comment = commentInput.value.trim();

        const newReview = {
            productId: curProduct.product.id,
            date: getTodayDate(),
            rate: ratingValue,
            comment: comment
        };

        const reqget = new XMLHttpRequest;
        reqget.open('GET', `http://localhost:3000/users?email=${curUser.email}`);
        reqget.send();
        reqget.addEventListener("readystatechange", function () {
            if (reqget.readyState === 4) {
                if (reqget.status == 200) {
                    let myUserData = JSON.parse(reqget.response);
                    let newreview = myUserData[0].review;
                    newreview.push(newReview);

                    let updatedUser = {
                        "id": myUserData[0].id,
                        "fristName": myUserData[0].fristName,
                        "lastName": myUserData[0].lastName,
                        "email": myUserData[0].email,
                        "password": myUserData[0].password,
                        "role": "user",
                        "cart": myUserData[0].cart,
                        "orders": myUserData[0].orders,
                        "review": newreview
                    };
                    const reqput = new XMLHttpRequest;
                    reqput.open('PUT', `http://localhost:3000/users/${myUserData[0].id}`);
                    reqput.setRequestHeader("Content-Type", "application/json");
                    reqput.send(JSON.stringify(updatedUser));
                }
            }
        });
        renderReviews();

        ratingInputs.forEach(r => r.checked = false);
        commentInput.value = '';
    });

    renderReviews();

    ratingInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            ratingError.innerText = '';
        });
    });
    commentInput.addEventListener('input', () => {
        if (commentInput.value.trim().length > 0) {
            commentError.innerText = '';
        }
    });
});