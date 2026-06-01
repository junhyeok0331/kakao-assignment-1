// DOM 요소 선택
const monthDisplay = document.getElementById('current-month-display');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');
const weeklyCalendar = document.getElementById('weekly-calendar');
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// 로컬스토리지 키 정의
const STORAGE_KEY = 'minimal_todo_app_todos';

// 상태 관리 변수
let todos = [];
let currentFilter = 'all'; 
let selectedDate = new Date(); // 현재 선택된 날짜 객체
let currentWeekStart = new Date(); // 현재 화면에 보여지는 주차의 월요일 날짜 객체

// 요일 라벨 배열 (월요일부터 시작)
const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

/**
 * 로컬스토리지에 현재 todos 배열 상태를 저장하는 함수 (Save)
 */
function saveToLocalStorage() {
    const cleanTodos = todos.map(todo => ({ ...todo, isEditing: false }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanTodos));
}

/**
 * 로컬스토리지에서 데이터를 읽어와 todos 배열을 복원하는 함수 (Load)
 */
function loadFromLocalStorage() {
    const storageData = localStorage.getItem(STORAGE_KEY);
    if (storageData) {
        try {
            todos = JSON.parse(storageData);
        } catch (error) {
            console.error('로컬스토리지 데이터 파싱 실패:', error);
            todos = [];
        }
    }
}

/**
 * Date 객체를 'YYYY-MM-DD' 형태의 문자열로 변환하는 헬퍼 함수
 * @param {Date} dateObj - 변환할 Date 객체
 * @returns {string} 'YYYY-MM-DD' 형식의 문자열
 */
function formatDateString(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 특정 날짜가 속한 주의 월요일 날짜를 구하는 함수
 * @param {Date} date - 기준 날짜
 * @returns {Date} 해당 주차의 월요일 Date 객체
 */
function getMonday(date) {
    const dateCopy = new Date(date);
    const day = dateCopy.getDay();
    // 일요일(0)을 7로 변환하여 월요일(1) 기준 오프셋 계산
    const diff = dateCopy.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(dateCopy.setDate(diff));
}

/**
 * 주간 캘린더 및 상단 월 텍스트를 화면에 렌더링하는 함수
 */
function renderWeeklyCalendar() {
    weeklyCalendar.innerHTML = ''; // 캘린더 초기화

    // 상단 텍스트 업데이트 (선택된 날짜의 연/월 기준)
    monthDisplay.innerText = `${currentWeekStart.getFullYear()}년 ${String(currentWeekStart.getMonth() + 1).padStart(2, '0')}월`;

    const todayStr = formatDateString(new Date());
    const selectedStr = formatDateString(selectedDate);

    // 월요일부터 일요일까지 7개의 날짜 카드 생성
    for (let i = 0; i < 7; i++) {
        const cardDate = new Date(currentWeekStart);
        cardDate.setDate(currentWeekStart.getDate() + i);
        const cardDateStr = formatDateString(cardDate);

        // 해당 날짜에 할당된 전체 Todo 개수 연산
        const dayTodoCount = todos.filter(todo => todo.date === cardDateStr).length;

        // 카드 컴포넌트 생성
        const card = document.createElement('div');
        card.className = 'date-card';
        
        // 시각적 상태 클래스 부여 (오늘 / 선택됨)
        if (cardDateStr === todayStr) card.classList.add('is-today');
        if (cardDateStr === selectedStr) card.classList.add('is-selected');

        // 요일 라벨
        const dayLabel = document.createElement('span');
        dayLabel.className = 'day-label';
        dayLabel.innerText = DAY_LABELS[i];

        // 일자 숫자
        const dateNumber = document.createElement('span');
        dateNumber.className = 'date-number';
        dateNumber.innerText = cardDate.getDate();

        // 개수 배지
        const todoCount = document.createElement('span');
        todoCount.className = 'todo-count';
        todoCount.innerText = dayTodoCount;

        // 클릭 시 해당 날짜 선택 기능 연동
        card.addEventListener('click', () => {
            selectedDate = cardDate;
            renderWeeklyCalendar();
            renderTodos();
        });

        card.appendChild(dayLabel);
        card.appendChild(dateNumber);
        card.appendChild(todoCount);
        weeklyCalendar.appendChild(card);
    }
}

/**
 * 새로운 Todo 객체를 생성하고 저장하는 함수 (Create)
 */
function createTodo() {
    const todoText = todoInput.value.trim();

    if (todoText === '') {
        alert('할 일을 입력해주세요!');
        todoInput.focus();
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: todoText,
        isCompleted: false,
        isEditing: false,
        date: formatDateString(selectedDate) // 클릭해 선택해 둔 날짜 기준으로 저장
    };

    todos.push(newTodo);
    todoInput.value = ''; 
    
    saveToLocalStorage();
    renderWeeklyCalendar(); // 상단 개수 배지 갱신을 위해 재출력
    renderTodos(); 
}

/**
 * Todo 항목을 삭제하는 함수 (Delete)
 */
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    
    saveToLocalStorage();
    renderWeeklyCalendar();
    renderTodos();
}

/**
 * Todo 완료 상태를 토글하는 함수 (Update - Status)
 */
function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, isCompleted: !todo.isCompleted };
        }
        return todo;
    });
    
    saveToLocalStorage();
    renderTodos();
}

/**
 * Todo 수정 모드를 제어하는 함수 (Update - Text)
 */
function toggleEdit(id, newText = null) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            if (todo.isEditing && newText !== null) {
                const trimmedText = newText.trim();
                if (trimmedText === '') {
                    alert('내용을 입력해주세요!');
                    return todo;
                }
                return { ...todo, text: trimmedText, isEditing: false };
            }
            return { ...todo, isEditing: !todo.isEditing };
        }
        return todo;
    });
    
    const targetTodo = todos.find(todo => todo.id === id);
    if (targetTodo && !targetTodo.isEditing && newText !== null) {
        saveToLocalStorage();
    }
    
    renderTodos();
}

/**
 * 필터링 탭을 변경하는 함수
 */
function changeFilter(filter) {
    currentFilter = filter;
    
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderTodos();
}

/**
 * 주차(Week)를 이동하는 함수
 * @param {number} weekOffset - 이동할 주차 수 (-1은 이전 주, 1은 다음 주)
 */
function navigateWeek(weekOffset) {
    currentWeekStart.setDate(currentWeekStart.getDate() + (weekOffset * 7));
    renderWeeklyCalendar();
}

/**
 * 상태 데이터를 기반으로 할 일 리스트를 화면에 그리는 함수 (Read)
 */
function renderTodos() {
    todoList.innerHTML = ''; 
    
    const targetDateStr = formatDateString(selectedDate);

    // 날짜 및 완료 여부 필터링
    let filteredTodos = todos.filter(todo => todo.date === targetDateStr);
    filteredTodos = filteredTodos.filter(todo => {
        if (currentFilter === 'active') return !todo.isCompleted;
        if (currentFilter === 'completed') return todo.isCompleted;
        return true;
    });

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.isCompleted ? 'completed' : ''}`;

        let contentElement;
        if (todo.isEditing) {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.className = 'edit-input';
            editInput.value = todo.text;
            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') toggleEdit(todo.id, editInput.value);
            });
            contentElement = editInput;
        } else {
            const todoSpan = document.createElement('span');
            todoSpan.className = 'todo-text';
            todoSpan.innerText = todo.text;
            contentElement = todoSpan;
        }

        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.innerText = todo.isCompleted ? '취소' : '완료';
        completeBtn.addEventListener('click', () => toggleComplete(todo.id));

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerText = todo.isEditing ? '저장' : '수정';
        editBtn.addEventListener('click', () => {
            if (todo.isEditing) {
                const input = li.querySelector('.edit-input');
                toggleEdit(todo.id, input.value);
            } else {
                toggleEdit(todo.id);
            }
        });
        
        //삭제는 더블 클릭
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerText = '삭제';
        deleteBtn.addEventListener('dblclick', () => deleteTodo(todo.id));

        btnGroup.appendChild(completeBtn);
        if (!todo.isCompleted) {
            btnGroup.appendChild(editBtn);
        }
        btnGroup.appendChild(deleteBtn);

        li.appendChild(contentElement);
        li.appendChild(btnGroup);

        todoList.appendChild(li);
    });
}

// 이벤트 리스너 등록
addBtn.addEventListener('click', createTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') createTodo();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => changeFilter(btn.dataset.filter));
});

// 주차 이동 내비게이션 이벤트 연결
prevWeekBtn.addEventListener('click', () => navigateWeek(-1));
nextWeekBtn.addEventListener('click', () => navigateWeek(1));

// 앱 초기 구동 및 상태 동기화
loadFromLocalStorage();
currentWeekStart = getMonday(selectedDate); // 초기 구동 시 오늘 날짜가 속한 주의 월요일 계산
renderWeeklyCalendar();
renderTodos();