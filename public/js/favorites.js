document.addEventListener('DOMContentLoaded', function() {
    const addFavoriteButtons = document.querySelectorAll('.add-favorite-btn');
    const deleteFavoriteButtons = document.querySelectorAll('.delete-favorite-btn');
    const favoritesList = document.getElementById('favoritesList');

    addFavoriteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const videoId = this.dataset.videoId;
            const title = this.dataset.title;
            const thumbnail = this.dataset.thumbnail;

            try {
                const response = await fetch('/favorites/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        videoId: videoId,
                        title: title,
                        thumbnailUrl: thumbnail
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    this.innerHTML = '<i class="bi bi-check-circle"></i> Added!';
                    this.classList.remove('btn-primary');
                    this.classList.add('btn-success');
                    this.disabled = true;
                    
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    alert(data.error || 'Error adding video');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error adding video to favorites');
            }
        });
    });

    deleteFavoriteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const id = this.dataset.id;
            
            if (!confirm('Are you sure you want to delete this video from favorites?')) {
                return;
            }

            try {
                const response = await fetch(`/favorites/${id}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    const favoriteItem = this.closest('.favorite-item');
                    favoriteItem.style.transition = 'opacity 0.3s';
                    favoriteItem.style.opacity = '0';
                    
                    setTimeout(() => {
                        favoriteItem.remove();
                        
                        if (favoritesList && favoritesList.children.length === 0) {
                            location.reload();
                        }
                    }, 300);
                } else {
                    alert(data.error || 'Error deleting video');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error deleting video');
            }
        });
    });

    if (favoritesList) {
        let draggedElement = null;

        favoritesList.querySelectorAll('.favorite-item').forEach(item => {
            item.draggable = true;
            
            item.addEventListener('dragstart', function(e) {
                draggedElement = this;
                this.style.opacity = '0.5';
            });

            item.addEventListener('dragend', function(e) {
                this.style.opacity = '1';
            });

            item.addEventListener('dragover', function(e) {
                e.preventDefault();
                if (draggedElement && draggedElement !== this) {
                    const allItems = Array.from(favoritesList.querySelectorAll('.favorite-item'));
                    const draggedIndex = allItems.indexOf(draggedElement);
                    const targetIndex = allItems.indexOf(this);

                    if (draggedIndex < targetIndex) {
                        favoritesList.insertBefore(draggedElement, this.nextSibling);
                    } else {
                        favoritesList.insertBefore(draggedElement, this);
                    }
                }
            });

            item.addEventListener('drop', async function(e) {
                e.preventDefault();
                if (draggedElement && draggedElement !== this) {
                    const allItems = Array.from(favoritesList.querySelectorAll('.favorite-item'));
                    const newPosition = allItems.indexOf(draggedElement);
                    const id = draggedElement.dataset.id;

                    try {
                        const response = await fetch('/favorites/reorder', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id: id,
                                newPosition: newPosition
                            })
                        });

                        const data = await response.json();
                        if (response.ok && data.success) {
                            draggedElement.dataset.position = newPosition;
                        } else {
                            location.reload();
                        }
                    } catch (error) {
                        console.error('Reorder error:', error);
                        location.reload();
                    }
                }
                draggedElement = null;
            });
        });
    }
});
