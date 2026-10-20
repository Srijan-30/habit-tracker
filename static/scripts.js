document.addEventListener('DOMContentLoaded', fetchHabits);

async function fetchHabits() {
    try {
        const res = await fetch('/api/habits');
        const habits = await res.json();
        renderHabits(habits);
    } catch (error) {
        console.error('Error fetching habits:', error);
    }
}

function renderHabits(habits) {
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';

    habits.forEach(habit => {
        const li = document.createElement('li');
        li.className = habit.completed ? 'completed' : '';
        
        li.innerHTML = `
            <span>${habit.title}</span>
            <span class="badge ${habit.completed ? 'done' : ''}">
                ${habit.completed ? 'Done ✓' : 'Pending'}
            </span>
        `;
        
        li.onclick = () => toggleHabit(habit.id);
        habitList.appendChild(li);
    });
}

async function addHabit() {
    const input = document.getElementById('habitInput');
    const title = input.value.trim();
    if (!title) return;

    try {
        await fetch('/api/habits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        input.value = '';
        fetchHabits();
    } catch (error) {
        console.error('Error adding habit:', error);
    }
}

async function toggleHabit(id) {
    try {
        await fetch(`/api/habits/${id}/toggle`, { method: 'POST' });
        fetchHabits();
    } catch (error) {
        console.error('Error toggling habit:', error);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addHabit();
    }
}


function renderHabits(habits) {
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';

    habits.forEach(habit => {
        const li = document.createElement('li');
        li.className = habit.completed ? 'completed' : '';
        
        li.innerHTML = `
            <span onclick="toggleHabit(${habit.id})" style="flex: 1; cursor: pointer;">${habit.title}</span>
            <span class="badge ${habit.completed ? 'done' : ''}" onclick="toggleHabit(${habit.id})" style="cursor: pointer;">
                ${habit.completed ? 'Done ✓' : 'Pending'}
            </span>
            <button class="delete-btn" onclick="deleteHabit(${habit.id}, event)">🗑️</button>
        `;
        
        habitList.appendChild(li);
    });
}

async function deleteHabit(id, event) {
    event.stopPropagation(); // Prevent triggering the toggle when clicking delete
    try {
        await fetch(`/api/habits/${id}`, { method: 'DELETE' });
        fetchHabits();
    } catch (error) {
        console.error('Error deleting habit:', error);
    }
}