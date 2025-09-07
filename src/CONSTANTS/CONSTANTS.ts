export const SUBJECTS = [
    {
        name: 'Programming with Python',
        image: '/assets/python.webp',
        code: 'SECE1234'
    }, 
    {
        name: 'Java',
        image: '/assets/java.png',
        code: 'SECE1445'
    },
    {
        name: 'DAA',
        image: '/assets/daa.jpg',
        code: 'SEIT1233'
    },
    {
        name: 'Operating System',
        image: '/assets/and.svg',
        code: 'SEIT7680'
    }
]

export const SUBJECTS_INFO = [
    {
        name: 'Programming with Python',
        lang: 'python',
        image: '/assets/python.webp',
        code: 'SECE1234',
        syllabus: [
            {
                title: 'Introduction to Python',
                content: ['History', 'Features of Python', 'Applications of Python', 'Wokring with python', 'Input and Output', 'Functions in Python', 'Variable Types', 'Basic Operators', 'Types of Data']
            }, 
            {
                title: 'Decision Structures in Python',
                content: ['Conditional Blocks Using if, else and else if', 'Simple for loops in python', 'for loops using ranges', 'While loops', 'Continue', 'Break']
            }, 
            {
                title: 'Array and Strings in Python',
                content : ['Arrays', 'Basic strings', 'Accessing strings', 'Basic operations', 'String slice', 'Testing', 'Searching']
            }
        ]
    }, 
    {
        name: 'Java',
        lang: 'java',
        image: '/assets/java.png',
        code: 'SECE1445',
        syllabus: [
            {
                title: 'Introduction',
                content: ['Programming language', 'Types and paradigms', 'Flavors of Java', 'Features of Java']
            },
            {
                title: 'Object Oriented Programming Fundamentals',
                content: ['Class Fundamentals', 'Object and Object reference', 'Object lifetime and Garbage collection', 'Creating and Operating Objects', 'Constructors and initialization code block']
            },
            {
                title: 'Class and Inheritance',
                content: ['Use and benefits of Inheritance in OOPS', 'Types of inheritance', 'Inheriting data members and methods']
            }
        ]
    },
    {
        name: 'DAA',
        lang: 'any',
        image: '/assets/daa.jpg',
        code: 'SEIT1233',
        syllabus: [
            {
                title: 'Fundamental concept of Algorithm Design and Analysis',
                content: ['Algorithm: Characteristics, specifications', 'Writing Pseudo code', 'Frequency count and its importance in analysis of an algorithm', 'Time complexity and space complexity', 'Big O and Omega notations']
            },
            {
                title: 'Divide and Conquer Algorithm',
                content: ['Basic algorithm and characteristics', 'Binary search: method and analysis for best and worst and average case', 'Quick sort', 'Merge Sort', 'Finding the largest and the smallest number in a list using divide and conquer', 'Matrix multiplication']
            }
        ]
    },
    {
        name: 'Operating System',
        image: '/assets/and.svg',
        code: 'SEIT7680',
        syllabus: [
            {
                title: 'Introduction to operating system',
                content: ['What is OS? History of OS', 'Types of OS', 'Concepts of OS']
            },
            {
                title: 'Processes and Threads Management',
                content: ['Process Concept', 'process state', 'process control block', 'CPU Scheduling: CPU-I/O burst cycle', 'types of schedulers', 'context switch', 'Preemptive Scheduling']
            }
        ]
    },
    
]

export const COMPLETED_ASSIGNMENTS = [
    {
        subject: 'Programming with Python',
        lang: 'python',
        code: 'SECE1234',
        assignments: [
            {
                id: '1',
                title: 'Hello World in Python',
                statement: 'Write your first Hello World program in Python Programming langauge.',
                receivedDate: '10:30 AM, 12 August, 2024',
                code: `print('hello world')`
            },
            {
                id: '2',
                title: 'Addition of variable in Python',
                statement: 'Write a python program to add two variables and print its output.',
                receivedDate: '9:00 AM, 13 August, 2024',
                code: `a = int(input()) \nb = int(input()) \nprint(a + b)`
            },
            {
                id: '3',
                title: 'Make a simple calculator program in Python',
                statement: 'Write a program which performs simple addition, subtraction, multiplication and division and takes two numbers for arithmetic operation.',
                receivedDate: '11:45 AM, 15 August, 2024',
                code: `a = int(input()) \nb = int(input()) \nprint(a + b)`
            },
        ]
    }
]

export const ASSIGNMENTS = [
    {
        subject: 'Programming with Python',
        lang: 'python',
        code: 'SECE1234',
        assignments: [
            {
                id: '1',
                title: 'Hello World in Python',
                statement: 'Write your first Hello World program in Python Programming langauge.',
                receivedDate: '10:30 AM, 12 August, 2024'
            },
            {
                id: '2',
                title: 'Addition of variable in Python',
                statement: 'Write a python program to add two variables and print its output.',
                receivedDate: '9:00 AM, 13 August, 2024'
            },
            {
                id: '3',
                title: 'Make a simple calculator program in Python',
                statement: 'Write a program which performs simple addition, subtraction, multiplication and division and takes two numbers for arithmetic operation.',
                receivedDate: '11:45 AM, 15 August, 2024'
            },
            {
                id: '4',
                title: 'Classes in Python',
                statement: 'Write a program in python to implement classes and objects by taking any example.',
                receivedDate: '11:45 AM, 15 August, 2024'
            },
            {
                id: '5',
                title: 'Lists in Python',
                statement: 'Write a python program to implement use of lists.',
                receivedDate: '9:00 AM, 13 August, 2024'
            },
            {
                id: '6',
                title: 'Call an API',
                statement: 'Write a program in python to make a REST api, using GET,POST methods.',
                receivedDate: '11:45 AM, 15 August, 2024'
            },
            {
                id: '7',
                title: 'Web scraping in Python',
                statement: 'Write a program to scrap a web using BeautifulSoup.',
                receivedDate: '11:45 AM, 15 August, 2024'
            }
        ]
    }, 
    {
        subject: 'Java',
        lang: 'java',
        code: 'SECE1445',
        assignments: [
            {
                id: '1',
                title: 'Hello World in Java',
                statement: 'Write your first Hello World program in Java Programming langauge.',
                receivedDate: '10:30 AM, 12 August, 2024'
            },
            {
                id: '2',
                title: 'Addition of variable in Java',
                statement: 'Write a Java program to add two variables and print its output.',
                receivedDate: '9:00 AM, 13 August, 2024'
            },
            {
                id: '3',
                title: 'Make a simple calculator program in Java',
                statement: 'Write a program which performs simple addition, subtraction, multiplication and division and takes two numbers for arithmetic operation.',
                receivedDate: '11:45 AM, 15 August, 2024'
            },
            {
                id: '4',
                title: 'Classes in Java',
                statement: 'Write a program in Java to implement classes and objects by taking any example.',
                receivedDate: '11:45 AM, 15 August, 2024'
            },
            {
                id: '5',
                title: 'Make an API',
                statement: 'Write a Java program to make a simple GET API which returns some string.',
                receivedDate: '9:00 AM, 13 August, 2024'
            },
            {
                id: '6',
                title: 'Filtering arrays',
                statement: 'Write a Java program to filter a specific name from the given array of strings of names.',
                receivedDate: '9:00 AM, 13 August, 2024'
            }
        ]
    }, 
    {
        subject: 'DAA',
        lang: 'any',
        code: 'SEIT1233',
        assignments: [
            {
                id: '1',
                title: 'Bubble Sort',
                statement: 'Write a program to implement bubble sorting algorithm',
                receivedDate: '10:30 AM, 12 August, 2024'
            },
            {
                id: '2',
                title: 'Binary Search',
                statement: 'Write a program to implement binary search algorithm to find a search element from an array.',
                receivedDate: '9:00 AM, 13 August, 2024'
            },
            {
                id: '3',
                title: 'Heap Sort',
                statement: 'Perform Heap Sorting algorithm.',
                receivedDate: '11:45 AM, 15 August, 2024'
            }
        ]
    }
]




export const COMPANY_DATA = [
    {
        name: 'InfoBits',
        profileImage: '/assets/google.png',
        jobRoles: [
            {
                role: 'Data Scientists',
                skillsRequired: ['Python', 'Python Libraries'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            { 
                role: 'React Developer',
                skillsRequired: ['ReactJS', 'HTML', 'CSS', 'JS', 'ReactNative'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            { 
                role: 'Devops Engineer',
                skillsRequired: ['Docker', 'Git', 'Github', 'Kubernete'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            {
                role: 'Cloud Engineer',
                skillsRequired: ['Azure', 'AWS'],
                salaryRange: '1.5 - 4 lakhs'
            },
        ],
        address: 'Hyderabad, Telangana, India',
        companySize: 'medium',
        numberOfEmployees: '30-50',
        work: 'remote'
    },
    {
        name: 'InfoBits 1',
        profileImage: '/assets/google.png',
        jobRoles: [
            {
                role: 'Data Scientists',
                skillsRequired: ['Python', 'Python Libraries'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
        ],
        address: 'Hyderabad, Telangana, India',
        companySize: 'medium',
        numberOfEmployees: '30-50',
        work: 'remote'
    },
    {
        name: 'Epsilon',
        profileImage: '/assets/google.png',
        jobRoles: [
            {
                role: 'Data Scientists',
                skillsRequired: ['Python', 'Python Libraries'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
        ],
        address: 'Hyderabad, Telangana, India',
        companySize: 'small',
        numberOfEmployees: '20-30',
        work: 'remote'
    },
    {
        name: 'TechCrunch',
        profileImage: '/assets/google.png',
        jobRoles: [
            { 
                role: 'React Developer',
                skillsRequired: ['ReactJS', 'HTML', 'CSS', 'JS', 'ReactNative'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            { 
                role: 'Devops Engineer',
                skillsRequired: ['Docker', 'Git', 'Github', 'Kubernete'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
        ],
        address: 'Hyderabad, Telangana, India',
        companySize: 'large',
        numberOfEmployees: '60-80',
        work: 'remote'
    },
    {
        name: 'TechCrunch',
        profileImage: '/assets/google.png',
        jobRoles: [
            { 
                role: 'Web Developer',
                skillsRequired: ['NextJS', 'ReactJS', 'HTML', 'CSS', 'JS', 'ReactNative'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            { 
                role: 'Devops Engineer',
                skillsRequired: ['Docker', 'Git', 'Github', 'Kubernete'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
        ],
        address: 'Hyderabad, Telangana, India',
        companySize: 'small',
        numberOfEmployees: '20-30',
        work: 'remote'
    },
    {
        name: 'Hammer',
        profileImage: '/assets/google.png',
        jobRoles: [
            {
                role: 'Data Scientists',
                skillsRequired: ['Python', 'Python Libraries'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            { 
                role: 'React Developer',
                skillsRequired: ['ReactJS', 'HTML', 'CSS', 'JS', 'ReactNative'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            { 
                role: 'Devops Engineer',
                skillsRequired: ['Docker', 'Git', 'Github', 'Kubernete'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            {
                role: 'Cloud Engineer',
                skillsRequired: ['Azure', 'AWS'],
                salaryRange: '1.5 - 4 lakhs'
            },
        ],
        address: 'Hyderabad, Telangana, India',
        companySize: 'large',
        numberOfEmployees: '70-100',
        work: 'remote'
    },
    {
        name: 'TechCrunch',
        profileImage: '/assets/google.png',
        jobRoles: [
            { 
                role: 'React Developer',
                skillsRequired: ['ReactJS', 'HTML', 'CSS', 'JS', 'ReactNative'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            { 
                role: 'Devops Engineer',
                skillsRequired: ['Docker', 'Git', 'Github', 'Kubernete'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
        ],
        address: 'Hyderabad, Telangana, India',
        companySize: 'large',
        numberOfEmployees: '60-80',
        work: 'remote'
    },
    {
        name: 'TechCrunch',
        profileImage: '/assets/google.png',
        jobRoles: [
            { 
                role: 'Web Developer',
                skillsRequired: ['NextJS', 'ReactJS', 'HTML', 'CSS', 'JS', 'ReactNative'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            { 
                role: 'Devops Engineer',
                skillsRequired: ['Docker', 'Git', 'Github', 'Kubernete'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
        ],
        address: 'Hyderabad, Telangana, India',
        companySize: 'small',
        numberOfEmployees: '20-30',
        work: 'remote'
    },
    {
        name: 'InfoBits',
        profileImage: '/assets/google.png',
        jobRoles: [
            {
                role: 'Data Scientists',
                skillsRequired: ['Python', 'Python Libraries'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            { 
                role: 'React Developer',
                skillsRequired: ['ReactJS', 'HTML', 'CSS', 'JS', 'ReactNative'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            { 
                role: 'Devops Engineer',
                skillsRequired: ['Docker', 'Git', 'Github', 'Kubernete'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
            {
                role: 'Cloud Engineer',
                skillsRequired: ['Azure', 'AWS'],
                salaryRange: '1.5 - 4 lakhs'
            },
        ],
        address: 'Hyderabad, Telangana, India',
        companySize: 'medium',
        numberOfEmployees: '30-50',
        work: 'remote'
    },
    {
        name: 'InfoBits 1',
        profileImage: '/assets/google.png',
        jobRoles: [
            {
                role: 'Data Scientists',
                skillsRequired: ['Python', 'Python Libraries'],
                salaryRange: '1.5 - 4 lakhs'
            }, 
        ],
        address: 'Hyderabad, Telangana, India',
        companySize: 'medium',
        numberOfEmployees: '30-50',
        work: 'remote'
    },
]