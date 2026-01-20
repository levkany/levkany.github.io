/**
 * Main JavaScript for levkany.com
 */

(function() {
    'use strict';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    
    const elements = {
        cursorCircle: document.querySelector('.cursor-circle'),
        gridBg: document.querySelector('.grid-bg'),
        terminalInput: document.getElementById('terminalInput'),
        terminalOutput: document.getElementById('terminalOutput'),
        terminalBody: document.getElementById('terminalBody'),
        terminal: document.querySelector('.terminal')
    };

    // ==========================================================================
    // Custom Cursor
    // ==========================================================================
    
    const cursor = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        lag: 0.15,

        init() {
            if (!elements.cursorCircle) return;

            document.addEventListener('mousemove', (e) => {
                this.targetX = e.clientX;
                this.targetY = e.clientY;
            });

            // Hover effects for interactive elements
            document.querySelectorAll('a, button, .gallery-btn').forEach(el => {
                el.addEventListener('mouseenter', () => elements.cursorCircle.classList.add('hover'));
                el.addEventListener('mouseleave', () => elements.cursorCircle.classList.remove('hover'));
            });

            // Hide on input elements
            document.querySelectorAll('input, textarea').forEach(el => {
                el.addEventListener('mouseenter', () => elements.cursorCircle.classList.add('hidden'));
                el.addEventListener('mouseleave', () => elements.cursorCircle.classList.remove('hidden'));
            });

            this.animate();
        },

        animate() {
            this.x += (this.targetX - this.x) * this.lag;
            this.y += (this.targetY - this.y) * this.lag;
            elements.cursorCircle.style.left = `${this.x}px`;
            elements.cursorCircle.style.top = `${this.y}px`;
            requestAnimationFrame(() => this.animate());
        }
    };

    // ==========================================================================
    // Grid Parallax
    // ==========================================================================
    
    const gridParallax = {
        init() {
            if (!elements.gridBg) return;

            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 30;
                const y = (e.clientY / window.innerHeight - 0.5) * 30;
                elements.gridBg.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
        }
    };

    // ==========================================================================
    // Terminal
    // ==========================================================================
    
    const terminal = {
        // Data
        projects: {
            1: { name: 'PyAPI', url: 'https://github.com/levkany/PyAPI' },
            2: { name: 'Simple Webhooks', url: 'https://github.com/levkany/simple-webhooks' },
            3: { name: 'Coding Challenges', url: 'https://github.com/levkany/challanges' }
        },

        posts: {
            1: { name: 'Building Scalable APIs', url: '#' },
            2: { name: 'Clean Architecture in Python', url: '#' }
        },

        // Commands
        commands: {
            help: () => `Commands:

  help                (show this message)
  about               (who am I)
  skills              (my tech stack)
  
  projects            (list projects)
  open project [id]   (view project)
  
  posts               (list posts)
  open post [id]      (read post)
  
  github              (open GitHub)
  linkedin            (open LinkedIn)
  download cv         (get my resume)
  contact             (how to reach me)
  clear               (clear screen)`,

            about: () => `Lev Kany — Backend Engineer

6+ years of experience building production
systems at scale. A strong problem solver
with deep expertise in Python.`,

            skills: () => `Technical Skills:

  • Python (Django, FastAPI, Flask)
  • PostgreSQL, MongoDB
  • REST API Design
  • Docker & Containerization
  • Git & CI/CD
  • Linux Administration`,

            contact: () => `Contact:

  GitHub:   github.com/levkany
  LinkedIn: linkedin.com/in/levkany
  
Type "github" or "linkedin" to open directly.`,

            github: () => {
                window.open('https://github.com/levkany', '_blank');
                return 'Opening GitHub...';
            },

            linkedin: () => {
                window.open('https://www.linkedin.com/in/levkany/', '_blank');
                return 'Opening LinkedIn...';
            },

            'download cv': () => {
                const link = document.createElement('a');
                link.href = '/resume.pdf';
                link.download = 'Lev_Kany_CV.pdf';
                link.click();
                return 'Downloading CV...';
            }
        },

        init() {
            if (!elements.terminalInput) return;

            elements.terminalInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const input = elements.terminalInput.value.trim();
                    if (input) {
                        this.addCommand(input);
                        const result = this.processCommand(input);
                        if (result.text !== null) {
                            this.addLine(result.text, result.type);
                        }
                    }
                    elements.terminalInput.value = '';
                }
            });

            // Focus terminal on click
            elements.terminal?.addEventListener('click', () => {
                elements.terminalInput.focus();
            });
        },

        processCommand(input) {
            const cmd = input.toLowerCase().trim();
            
            // Exact commands
            if (this.commands[cmd]) {
                return { type: 'response', text: this.commands[cmd]() };
            }

            // Clear command
            if (cmd === 'clear') {
                elements.terminalOutput.innerHTML = '';
                return { type: 'response', text: null };
            }

            // Projects list
            if (cmd === 'projects') {
                let output = 'Projects:\n\n';
                for (const [id, project] of Object.entries(this.projects)) {
                    output += `  [${id}] ${project.name}\n`;
                }
                output += '\nUse "open project [id]" to view a project.';
                return { type: 'response', text: output };
            }

            // Posts list
            if (cmd === 'posts') {
                let output = 'Posts:\n\n';
                for (const [id, post] of Object.entries(this.posts)) {
                    output += `  [${id}] ${post.name}\n`;
                }
                output += '\nUse "open post [id]" to read a post.';
                return { type: 'response', text: output };
            }

            // Open project
            if (cmd.startsWith('open project ')) {
                const id = cmd.replace('open project ', '').trim();
                if (this.projects[id]) {
                    window.open(this.projects[id].url, '_blank');
                    return { type: 'success', text: `Opening ${this.projects[id].name}...` };
                }
                return { type: 'error', text: 'Project not found. Use "projects" to see available projects.' };
            }
            
            // Open post
            if (cmd.startsWith('open post ')) {
                const id = cmd.replace('open post ', '').trim();
                if (this.posts[id]) {
                    window.open(this.posts[id].url, '_blank');
                    return { type: 'success', text: `Opening ${this.posts[id].name}...` };
                }
                return { type: 'error', text: 'Post not found. Use "posts" to see available posts.' };
            }
            
            // Help flags
            if (cmd === '--help' || cmd === '-h') {
                return { type: 'response', text: this.commands.help() };
            }
            
            // Unknown command
            return { type: 'error', text: `Command not found: ${input}\nType "help" for available commands.` };
        },

        addLine(text, type = 'response') {
            if (text === null) return;
            
            text.split('\n').forEach(line => {
                const div = document.createElement('div');
                div.className = `terminal-line ${type}`;
                div.innerHTML = (line || ' ').replace(/(\([^)]+\))/g, '<span class="dim">$1</span>');
                elements.terminalOutput.appendChild(div);
            });
            
            elements.terminalBody.scrollTop = elements.terminalBody.scrollHeight;
        },

        addCommand(cmd) {
            const div = document.createElement('div');
            div.className = 'terminal-line command';
            div.textContent = cmd;
            elements.terminalOutput.appendChild(div);
        }
    };

    // ==========================================================================
    // Initialize
    // ==========================================================================
    
    document.addEventListener('DOMContentLoaded', () => {
        cursor.init();
        gridParallax.init();
        terminal.init();
    });

})();

