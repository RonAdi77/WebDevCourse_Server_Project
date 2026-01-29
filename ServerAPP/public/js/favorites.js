document.addEventListener("DOMContentLoaded", function () {
    const addBtns = document.querySelectorAll(".add-favorite-btn");
    const deleteBtns = document.querySelectorAll(".delete-favorite-btn");
    const favoritesList = document.getElementById("favoritesList");

    addBtns.forEach(function (btn) {
        btn.addEventListener("click", async function () {
            const videoId = this.dataset.videoId;
            const title = this.dataset.title;
            const thumbnail = this.dataset.thumbnail;
            try {
                const res = await fetch("/favorites/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ videoId, title, thumbnailUrl: thumbnail }),
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    this.innerHTML = "<i class=\"bi bi-check-circle\"></i> Added!";
                    this.classList.remove("btn-primary");
                    this.classList.add("btn-success");
                    this.disabled = true;
                    setTimeout(function () { location.reload(); }, 1000);
                } else {
                    alert(data.error || "Error adding video");
                }
            } catch (e) {
                console.error(e);
                alert("Error adding video to favorites");
            }
        });
    });

    deleteBtns.forEach(function (btn) {
        btn.addEventListener("click", async function () {
            const id = this.dataset.id;
            if (!confirm("Are you sure you want to delete this video from favorites?")) return;
            try {
                const res = await fetch("/favorites/" + id, { method: "DELETE" });
                const data = await res.json();
                if (res.ok && data.success) {
                    const item = this.closest(".favorite-item");
                    item.style.transition = "opacity 0.3s";
                    item.style.opacity = "0";
                    setTimeout(function () {
                        item.remove();
                        if (favoritesList && favoritesList.children.length === 0) location.reload();
                    }, 300);
                } else {
                    alert(data.error || "Error deleting video");
                }
            } catch (e) {
                console.error(e);
                alert("Error deleting video");
            }
        });
    });

    if (favoritesList) {
        let dragged = null;
        favoritesList.querySelectorAll(".favorite-item").forEach(function (item) {
            item.draggable = true;
            item.addEventListener("dragstart", function () { dragged = this; this.style.opacity = "0.5"; });
            item.addEventListener("dragend", function () { this.style.opacity = "1"; });
            item.addEventListener("dragover", function (e) {
                e.preventDefault();
                if (dragged && dragged !== this) {
                    const all = Array.from(favoritesList.querySelectorAll(".favorite-item"));
                    const idx = all.indexOf(dragged);
                    const targetIdx = all.indexOf(this);
                    if (idx < targetIdx) favoritesList.insertBefore(dragged, this.nextSibling);
                    else favoritesList.insertBefore(dragged, this);
                }
            });
            item.addEventListener("drop", async function (e) {
                e.preventDefault();
                if (dragged && dragged !== this) {
                    const all = Array.from(favoritesList.querySelectorAll(".favorite-item"));
                    const newPos = all.indexOf(dragged);
                    const id = dragged.dataset.id;
                    try {
                        const res = await fetch("/favorites/reorder", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: id, newPosition: newPos }),
                        });
                        const data = await res.json();
                        if (res.ok && data.success) dragged.dataset.position = newPos;
                        else location.reload();
                    } catch (err) { location.reload(); }
                }
                dragged = null;
            });
        });
    }
});
