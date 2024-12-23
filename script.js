document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const modal = document.getElementById('taskDetailsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalDueDate = document.getElementById('modalDueDate');
    const closeModal = document.getElementById('closeModal');

    // Handle task form submission
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get form data
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('dueDate').value;
        const priority = document.getElementById('priority').value;

        // Create task element
        const taskItem = createTaskItem(title, description, dueDate, priority);

        // Add to the correct priority list
        const priorityList = document.getElementById(`${priority}-priority`).querySelector('ul');
        priorityList.appendChild(taskItem);

        // Reapply pagination
        applyPagination(priorityList, 5);

        // Clear the form
        taskForm.reset();
    });

    // Close modal functionality
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Helper: Create a task item
    function createTaskItem(title, description, dueDate, priority) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <strong>${title}</strong> (Due: ${dueDate})
            <br>
            <button class="view-details">View Details</button>
            <button class="delete-task">Delete</button>
        `;

        // Add event listener for "View Details"
        taskItem.querySelector('.view-details').addEventListener('click', () => {
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalDueDate.textContent = `Due Date: ${dueDate}`;
            modal.style.display = 'flex';
        });

        // Add event listener for "Delete Task"
        taskItem.querySelector('.delete-task').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                taskItem.remove();
                const list = document.getElementById(`${priority}-priority`).querySelector('ul');
                applyPagination(list, 5);
            }
        });

        return taskItem;
    }

    // Pagination Logic
    function applyPagination(list, itemsPerPage) {
        const tasks = Array.from(list.children);
        let currentPage = 1;

        function renderPage() {
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            tasks.forEach((task, index) => {
                task.style.display = index >= start && index < end ? 'block' : 'none';
            });
        }

        function createPaginationControls() {
            // Remove existing pagination controls
            const existingControls = list.parentElement.querySelector('.pagination');
            if (existingControls) {
                existingControls.remove();
            }

            const paginationControls = document.createElement('div');
            paginationControls.classList.add('pagination');

            const totalPages = Math.ceil(tasks.length / itemsPerPage);

            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.textContent = i;

                button.addEventListener('click', () => {
                    currentPage = i;
                    renderPage();
                });

                paginationControls.appendChild(button);
            }

            list.parentElement.appendChild(paginationControls);
        }

        renderPage();
        createPaginationControls();
    }

    // Apply pagination to all priority lists on page load
    ['high-priority', 'medium-priority', 'low-priority'].forEach((id) => {
        const list = document.getElementById(id).querySelector('ul');
        applyPagination(list, 5); // Show 5 tasks per page
    });
});
