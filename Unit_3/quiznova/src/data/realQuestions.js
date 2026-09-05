import { uid } from '../utils/storage';

// Real, hand-written MCQ questions with correct answers.
// Each subject has ~6-7 questions; Mathematics included as a new subject.
export const REAL_QUESTIONS_BY_SUBJECT = {
  'JavaScript Fundamentals': [
    { text: 'Which keyword declares a block-scoped variable in JavaScript?', options: ['var', 'let', 'function', 'static'], correctAnswer: 'let', difficulty: 'Easy', explanation: '"let" declares a block-scoped variable, unlike "var" which is function-scoped.' },
    { text: 'What does the "typeof" operator return for an array?', options: ['array', 'object', 'list', 'undefined'], correctAnswer: 'object', difficulty: 'Medium', explanation: 'Arrays are a type of object in JavaScript, so typeof returns "object".' },
    { text: 'Which method converts a JSON string into a JavaScript object?', options: ['JSON.stringify()', 'JSON.parse()', 'Object.assign()', 'JSON.toObject()'], correctAnswer: 'JSON.parse()', difficulty: 'Easy', explanation: 'JSON.parse() parses a JSON string and returns a JS object.' },
    { text: 'What is the output of 3 + "3" in JavaScript?', options: ['6', '"33"', 'NaN', 'Error'], correctAnswer: '"33"', difficulty: 'Medium', explanation: 'The number is coerced into a string, resulting in concatenation: "33".' },
    { text: 'Which of these is used to handle asynchronous operations in modern JS?', options: ['Promises', 'Loops', 'Arrays', 'Switch statements'], correctAnswer: 'Promises', difficulty: 'Medium', explanation: 'Promises (and async/await) are the standard way to manage asynchronous code.' },
    { text: 'What does "===" check in JavaScript?', options: ['Value only', 'Type only', 'Value and type', 'Reference only'], correctAnswer: 'Value and type', difficulty: 'Easy', explanation: 'The strict equality operator checks both value and type without coercion.' },
    { text: 'Which array method creates a new array with results of calling a function on every element?', options: ['forEach()', 'map()', 'filter()', 'reduce()'], correctAnswer: 'map()', difficulty: 'Medium', explanation: 'map() returns a new array by transforming each element.' },
  ],
  'React Fundamentals': [
    { text: 'What hook is used to manage state in a functional component?', options: ['useEffect', 'useState', 'useRef', 'useMemo'], correctAnswer: 'useState', difficulty: 'Easy', explanation: 'useState returns a state variable and a setter function.' },
    { text: 'Which hook runs side effects after render?', options: ['useState', 'useEffect', 'useCallback', 'useContext'], correctAnswer: 'useEffect', difficulty: 'Easy', explanation: 'useEffect runs after the component renders, ideal for side effects.' },
    { text: 'What is the purpose of "key" prop in a list?', options: ['Styling', 'Help React identify changed items', 'Set component name', 'Enable animations'], correctAnswer: 'Help React identify changed items', difficulty: 'Medium', explanation: 'Keys help React efficiently update and reorder list items.' },
    { text: 'What does JSX stand for?', options: ['Java Syntax Extension', 'JavaScript XML', 'JSON Syntax Extension', 'Java Server XML'], correctAnswer: 'JavaScript XML', difficulty: 'Easy', explanation: 'JSX is a syntax extension that lets you write HTML-like code in JavaScript.' },
    { text: 'Which method is used to pass data from parent to child component?', options: ['State', 'Props', 'Context only', 'Refs'], correctAnswer: 'Props', difficulty: 'Easy', explanation: 'Props are used to pass data down from parent to child components.' },
    { text: 'What does useContext hook allow you to do?', options: ['Manage local state', 'Access context values without prop drilling', 'Create side effects', 'Optimize renders'], correctAnswer: 'Access context values without prop drilling', difficulty: 'Medium', explanation: 'useContext lets components consume context values directly.' },
    { text: 'Which lifecycle-like behavior does an empty dependency array [] in useEffect represent?', options: ['Runs every render', 'Runs once on mount', 'Never runs', 'Runs on unmount only'], correctAnswer: 'Runs once on mount', difficulty: 'Medium', explanation: 'An empty dependency array makes the effect run only once after initial render.' },
  ],
  'SQL & DBMS': [
    { text: 'Which SQL clause is used to filter records?', options: ['SELECT', 'WHERE', 'ORDER BY', 'GROUP BY'], correctAnswer: 'WHERE', difficulty: 'Easy', explanation: 'The WHERE clause filters records based on a condition.' },
    { text: 'What does "PRIMARY KEY" enforce in a table?', options: ['Sorting order', 'Uniqueness and non-null values', 'Default values', 'Data type'], correctAnswer: 'Uniqueness and non-null values', difficulty: 'Easy', explanation: 'A primary key uniquely identifies each row and cannot be NULL.' },
    { text: 'Which SQL JOIN returns rows only when there is a match in both tables?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER JOIN'], correctAnswer: 'INNER JOIN', difficulty: 'Medium', explanation: 'INNER JOIN returns only rows with matching values in both tables.' },
    { text: 'What normal form eliminates transitive dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: '3NF', difficulty: 'Hard', explanation: 'Third Normal Form (3NF) removes transitive dependencies on the primary key.' },
    { text: 'Which command is used to remove a table completely from a database?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], correctAnswer: 'DROP', difficulty: 'Easy', explanation: 'DROP TABLE removes the table structure and data entirely.' },
    { text: 'What does ACID stand for in DBMS transactions?', options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Index, Data', 'Atomic, Complex, Isolated, Data', 'Aggregation, Consistency, Index, Duration'], correctAnswer: 'Atomicity, Consistency, Isolation, Durability', difficulty: 'Medium', explanation: 'ACID properties ensure reliable processing of database transactions.' },
    { text: 'Which SQL function returns the number of rows in a result set?', options: ['SUM()', 'COUNT()', 'TOTAL()', 'ROWS()'], correctAnswer: 'COUNT()', difficulty: 'Easy', explanation: 'COUNT() returns the number of rows matching a query.' },
  ],
  'Data Structures': [
    { text: 'Which data structure uses LIFO (Last In First Out) order?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correctAnswer: 'Stack', difficulty: 'Easy', explanation: 'A stack follows Last In First Out ordering for insertion and removal.' },
    { text: 'What is the time complexity of binary search on a sorted array?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], correctAnswer: 'O(log n)', difficulty: 'Medium', explanation: 'Binary search halves the search space each step, giving O(log n).' },
    { text: 'Which data structure is ideal for implementing a FIFO order?', options: ['Stack', 'Queue', 'Binary Tree', 'Hash Map'], correctAnswer: 'Queue', difficulty: 'Easy', explanation: 'A queue processes elements in First In First Out order.' },
    { text: 'What is the worst-case time complexity of quicksort?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n^2)', difficulty: 'Hard', explanation: 'Quicksort degrades to O(n^2) when the pivot selection is consistently poor.' },
    { text: 'Which traversal visits the root node first in a binary tree?', options: ['In-order', 'Pre-order', 'Post-order', 'Level-order'], correctAnswer: 'Pre-order', difficulty: 'Medium', explanation: 'Pre-order traversal visits root, then left subtree, then right subtree.' },
    { text: 'What structure does a hash table use internally to handle collisions (commonly)?', options: ['Binary tree', 'Linked list (chaining)', 'Stack', 'Circular queue'], correctAnswer: 'Linked list (chaining)', difficulty: 'Medium', explanation: 'Chaining stores colliding elements in a linked list at the same bucket.' },
    { text: 'What is the space complexity of an adjacency matrix for a graph with V vertices?', options: ['O(V)', 'O(V + E)', 'O(V^2)', 'O(log V)'], correctAnswer: 'O(V^2)', difficulty: 'Hard', explanation: 'An adjacency matrix requires a V x V grid, giving O(V^2) space.' },
  ],
  'Python Basics': [
    { text: 'Which keyword is used to define a function in Python?', options: ['func', 'def', 'function', 'lambda'], correctAnswer: 'def', difficulty: 'Easy', explanation: '"def" is used to define a function in Python.' },
    { text: 'What data type is the result of 7 // 2 in Python?', options: ['float', 'int', 'str', 'complex'], correctAnswer: 'int', difficulty: 'Easy', explanation: 'The // operator performs floor division and returns an integer for int operands.' },
    { text: 'Which of the following is a mutable data type in Python?', options: ['tuple', 'string', 'list', 'int'], correctAnswer: 'list', difficulty: 'Medium', explanation: 'Lists are mutable, meaning their contents can be changed after creation.' },
    { text: 'What does the "len()" function return for a dictionary?', options: ['Sum of values', 'Number of key-value pairs', 'Number of keys only', 'Number of values only'], correctAnswer: 'Number of key-value pairs', difficulty: 'Easy', explanation: 'len() on a dict returns the count of key-value pairs.' },
    { text: 'Which statement is used to handle exceptions in Python?', options: ['catch', 'try/except', 'error/handle', 'try/catch'], correctAnswer: 'try/except', difficulty: 'Easy', explanation: 'Python uses try/except blocks for exception handling.' },
    { text: 'What is the output of list(range(3)) in Python?', options: ['[1, 2, 3]', '[0, 1, 2]', '[0, 1, 2, 3]', '[3, 2, 1]'], correctAnswer: '[0, 1, 2]', difficulty: 'Medium', explanation: 'range(3) generates 0, 1, 2 — starting at 0 and excluding 3.' },
    { text: 'Which keyword creates an anonymous function in Python?', options: ['def', 'anon', 'lambda', 'func'], correctAnswer: 'lambda', difficulty: 'Medium', explanation: 'lambda creates small anonymous, inline functions.' },
  ],
  'Web Development': [
    { text: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheets', 'Colorful Style Syntax'], correctAnswer: 'Cascading Style Sheets', difficulty: 'Easy', explanation: 'CSS stands for Cascading Style Sheets, used for styling HTML.' },
    { text: 'Which HTML tag is used to link an external CSS file?', options: ['<style>', '<script>', '<link>', '<css>'], correctAnswer: '<link>', difficulty: 'Easy', explanation: 'The <link> tag in the <head> connects an external stylesheet.' },
    { text: 'Which HTTP method is typically used to submit form data that changes server state?', options: ['GET', 'POST', 'HEAD', 'OPTIONS'], correctAnswer: 'POST', difficulty: 'Medium', explanation: 'POST is used to send data that creates or updates resources on the server.' },
    { text: 'What does responsive web design primarily rely on?', options: ['Fixed pixel widths', 'Media queries and flexible layouts', 'Only JavaScript', 'Server-side rendering only'], correctAnswer: 'Media queries and flexible layouts', difficulty: 'Medium', explanation: 'Responsive design uses media queries and flexible grids to adapt to screen sizes.' },
    { text: "Which CSS property controls the space between an element's border and its content?", options: ['margin', 'padding', 'spacing', 'gap'], correctAnswer: 'padding', difficulty: 'Easy', explanation: 'Padding is the space inside an element, between content and border.' },
    { text: 'What is the purpose of the "alt" attribute on an <img> tag?', options: ['Set image size', 'Provide alternative text for accessibility', 'Link to another page', 'Apply CSS styling'], correctAnswer: 'Provide alternative text for accessibility', difficulty: 'Easy', explanation: 'The alt attribute describes the image for screen readers and when it fails to load.' },
    { text: 'Which status code indicates a successful HTTP request?', options: ['404', '500', '200', '301'], correctAnswer: '200', difficulty: 'Easy', explanation: 'HTTP 200 means "OK" — the request succeeded.' },
  ],
  'Computer Networks': [
    { text: 'Which layer of the OSI model is responsible for routing?', options: ['Data Link', 'Network', 'Transport', 'Application'], correctAnswer: 'Network', difficulty: 'Medium', explanation: 'The Network layer (Layer 3) handles logical addressing and routing.' },
    { text: 'What does DNS stand for?', options: ['Domain Name System', 'Data Network Service', 'Digital Naming Standard', 'Domain Network Server'], correctAnswer: 'Domain Name System', difficulty: 'Easy', explanation: 'DNS translates domain names into IP addresses.' },
    { text: 'Which protocol is connection-oriented and reliable?', options: ['UDP', 'TCP', 'IP', 'ICMP'], correctAnswer: 'TCP', difficulty: 'Medium', explanation: 'TCP establishes a connection and guarantees reliable, ordered delivery.' },
    { text: 'What is the default port number for HTTPS?', options: ['80', '21', '443', '25'], correctAnswer: '443', difficulty: 'Medium', explanation: 'HTTPS traffic typically uses port 443.' },
    { text: 'Which device operates at the Data Link layer and forwards frames based on MAC address?', options: ['Router', 'Switch', 'Hub', 'Modem'], correctAnswer: 'Switch', difficulty: 'Medium', explanation: 'A switch uses MAC addresses to forward frames within a LAN.' },
    { text: 'What does IP stand for in networking?', options: ['Internet Protocol', 'Internal Process', 'Internet Provider', 'Information Packet'], correctAnswer: 'Internet Protocol', difficulty: 'Easy', explanation: 'IP (Internet Protocol) handles addressing and routing of packets.' },
    { text: 'Which topology connects all devices to a single central hub?', options: ['Bus', 'Ring', 'Star', 'Mesh'], correctAnswer: 'Star', difficulty: 'Easy', explanation: 'In a star topology, every device connects to a central hub or switch.' },
  ],
  'Software Engineering': [
    { text: 'Which SDLC model follows a strict sequential phase approach?', options: ['Agile', 'Waterfall', 'Spiral', 'Scrum'], correctAnswer: 'Waterfall', difficulty: 'Easy', explanation: 'The Waterfall model progresses linearly through defined phases.' },
    { text: 'What does UML stand for?', options: ['Unified Modeling Language', 'Universal Markup Language', 'Unified Machine Learning', 'User Modeling Layer'], correctAnswer: 'Unified Modeling Language', difficulty: 'Easy', explanation: 'UML is a standard modeling language for visualizing system design.' },
    { text: 'Which testing type verifies individual units of code in isolation?', options: ['Integration testing', 'Unit testing', 'System testing', 'Acceptance testing'], correctAnswer: 'Unit testing', difficulty: 'Easy', explanation: 'Unit testing checks the smallest testable parts of an application.' },
    { text: 'In Agile, what is a short, time-boxed iteration called?', options: ['Milestone', 'Sprint', 'Release', 'Cycle'], correctAnswer: 'Sprint', difficulty: 'Easy', explanation: 'A sprint is a fixed-length iteration in Scrum, typically 1-4 weeks.' },
    { text: 'What principle states a class should have only one reason to change?', options: ['Open/Closed Principle', 'Single Responsibility Principle', 'Liskov Substitution Principle', 'Dependency Inversion Principle'], correctAnswer: 'Single Responsibility Principle', difficulty: 'Hard', explanation: 'SRP is one of the SOLID principles focused on cohesive class design.' },
    { text: 'What does CI/CD stand for?', options: ['Code Integration/Code Delivery', 'Continuous Integration/Continuous Deployment', 'Central Index/Central Data', 'Code Inspection/Code Debugging'], correctAnswer: 'Continuous Integration/Continuous Deployment', difficulty: 'Medium', explanation: 'CI/CD automates building, testing, and deploying code changes.' },
    { text: 'Which document captures what a system should do, from the user perspective?', options: ['Design document', 'Requirements specification', 'Test plan', 'Source code'], correctAnswer: 'Requirements specification', difficulty: 'Medium', explanation: 'A requirements specification defines what the system must accomplish.' },
  ],
  'Mathematics': [
    { text: 'What is the value of 7 x 8?', options: ['54', '56', '58', '64'], correctAnswer: '56', difficulty: 'Easy', explanation: '7 multiplied by 8 equals 56.' },
    { text: 'What is the derivative of x^2 with respect to x?', options: ['x', '2x', 'x^2', '2'], correctAnswer: '2x', difficulty: 'Medium', explanation: 'Using the power rule, d/dx(x^2) = 2x.' },
    { text: 'What is the value of pi (π) rounded to two decimal places?', options: ['3.12', '3.14', '3.16', '3.18'], correctAnswer: '3.14', difficulty: 'Easy', explanation: 'Pi is approximately 3.14159, which rounds to 3.14.' },
    { text: 'What is the sum of the interior angles of a triangle?', options: ['90°', '180°', '270°', '360°'], correctAnswer: '180°', difficulty: 'Easy', explanation: 'The interior angles of any triangle always sum to 180 degrees.' },
    { text: 'What is the square root of 144?', options: ['10', '11', '12', '14'], correctAnswer: '12', difficulty: 'Easy', explanation: '12 x 12 = 144, so the square root of 144 is 12.' },
    { text: 'If a die is rolled once, what is the probability of getting an even number?', options: ['1/6', '1/3', '1/2', '2/3'], correctAnswer: '1/2', difficulty: 'Medium', explanation: 'There are 3 even numbers (2,4,6) out of 6 total outcomes, giving 3/6 = 1/2.' },
    { text: 'What is the value of log base 10 of 100?', options: ['1', '2', '10', '100'], correctAnswer: '2', difficulty: 'Medium', explanation: 'log10(100) = 2 because 10^2 = 100.' },
    { text: 'What type of number is 7 (in terms of primality)?', options: ['Composite', 'Prime', 'Neither', 'Both'], correctAnswer: 'Prime', difficulty: 'Easy', explanation: '7 has only two factors, 1 and itself, making it a prime number.' },
  ],
};

export function buildRealQuestions() {
  const all = [];
  Object.entries(REAL_QUESTIONS_BY_SUBJECT).forEach(([subject, list]) => {
    list.forEach((q) => {
      all.push({
        id: uid('q'),
        subject,
        text: q.text,
        type: 'mcq',
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: 5,
        difficulty: q.difficulty,
        category: subject,
        explanation: q.explanation,
      });
    });
  });
  return all;
}
