
/**
 * @author 0ut1andish <out.ladnish@gmail.com>
 */

const $cli     = $('#cli');
const $log     = $('#log');
const $line    = $('#line');
const $tag     = $('#tag');

const OWNER    = '0ut1andish';

const carbun = {
   version: '1.0.0',
   currentInputPure: '',
   currentInputParsed: '',
   caretPosition: 0,
   log: [],
   logIndex: 0,
   commands: {
      'help': {
         func: data => {
            for (let cmd in carbun.commands) {
               carbun.echo(`<span class='exe' style='width: 100px;display: inline-block'>${cmd.toUpperCase()}</span> : ${carbun.commands[cmd].desc}`, 'comment');
            }
         },
         desc: `display carbun's commands list`
      },
      'execute': {
         func: data => {
            carbun.echo('Ops, something went wrong, try again later !', 'warning');
         },
         desc: `some toxic shit, DONT use this command !!!`
      },
      'clear': {
         func: data => {
            $log.html('');
         },
         desc: `clear the command line`
      },
      'reload': {
         func: data => {
            document.location.reload();
         },
         desc: `reload the page`
      },
      'eval': {
         func: data => {
            carbun.echo(eval(data));
         },
         desc: `run js code`
      },
      'projects': {
         func: data => {
            const projects = {
               'Carbun': {
                  link: 'https://0utlandish.github.io/',
                  desc: 'mmm, this one is yummy.'
               },
               'Linkuage': {
                  link: 'https://0utlandish.github.io/',
                  desc: 'this is a very good project, please make sure to check it out !'
               }
            }
            for (let project in projects) {
               carbun.echo(`<i>${project}</i> : ${projects[project].desc} [<a target='blank' href='${projects[project].link}'>open</a>]`, 'comment')
            }
         },
         desc: `display list of ${OWNER}'s project`
      },
      'msg': {
         func: data => {
            if (data === '') {
               carbun.echo('message body is required', 'error');
               return;
            }
            carbun.echo('message has been sent successfully', 'success');
         },
         desc: `send me private message`
      },
      'about': {
         func: data => {
            carbun.echo(`name is komeil, but call me 0utlandish pls, born in 1 august 1999, hovering in programming ocean, always wanna learn more, office fan, like js & love php`, 'comment')
         },
         desc: 'get to know me'
      },
      'github': {
         func: data => {
            window.open('https://github.com/0utlandish', '_blank');
         },
         desc: 'my github'
      },
      'codepen': {
         func: data => {
            window.open('https://codepen.io/0utlandish', '_blank');
         },
         desc: 'codepen profile'
      },
      'soundcloud': {
         func: data => {
            window.open('https://soundcloud.com/out-landish-221633027', '_blank');
         },
         desc: 'listen to some good musics'
      },
      'instagram': {
         func: data => {
            window.open('https://www.instagram.com/komeil.tl/', '_blank');
         },
         desc: 'its public'
      },
   },
   specialFunctions: {
      'Enter': () => {
         if (carbun.currentInputPure.trim() === '') return;
         carbun.exec(carbun.currentInputPure.trim());
         carbun.specialFunctions['Escape']();
      },
      'Backspace': (ctrl) => {
         if (ctrl) {
            carbun.currentInputPure = carbun.currentInputPure.slice(carbun.caretPosition);
            carbun.caretPosition    = 0;
            carbun.parse();
            return;
         }
         if (carbun.caretPosition === 0) return;
         const deletedChar       = carbun.currentInputPure[carbun.caretPosition - 1];
         carbun.currentInputPure = carbun.currentInputPure.slice(0, carbun.caretPosition - 1) + carbun.currentInputPure.slice(carbun.caretPosition);
         carbun.caretPosition    = Math.max(0, carbun.caretPosition - 1);
         if ($(window).height() - $('.selected').offset().top > 200) {
            const falling           = $(`<span class='falling'>${deletedChar}</span>`);
            falling.css('left', $('.selected').offset().left);
            falling.css('bottom', $(window).height() - $('.selected').offset().top - $('.selected').height() * 1.5);
            $('body').append(falling);
            setTimeout(() => {
               falling.remove();
            }, 2500);
         }
         carbun.parse();
      },
      'Escape': () => {
         carbun.currentInputPure = '';
         carbun.caretPosition    = 0;
         carbun.parse();
      },
      'ArrowLeft': () => {
         carbun.caretPosition    = Math.max(0, carbun.caretPosition - 1);
         carbun.parse();
      },
      'ArrowRight': () => {
         carbun.caretPosition    = Math.min(carbun.currentInputPure.length, carbun.caretPosition + 1);
         carbun.parse();
      },
   },
   exec: (cmd) => {
      carbun.echo(`» : ${cmd}`);
      cmd = cmd.split(' ');
      if (!carbun.commands[cmd[0]]) {
         carbun.echo(`unknown command '${cmd[0]}'`, 'error');
      } else {
         carbun.commands[cmd.splice(0, 1)].func(cmd.join(' '));
      }
      $cli.scrollTop($cli[0].scrollHeight);
   },
   insert: (char) => {
      carbun.currentInputPure    = carbun.currentInputPure.slice(0, carbun.caretPosition) + char + carbun.currentInputPure.slice(carbun.caretPosition);
      carbun.caretPosition      += 1;
      carbun.parse();
   },
   echo: (message, type = 'normal') => {
      const scheme = {
         'error'  : '#fa7171',
         'warning': '#fff176',
         'normal' : '#cccccc',
         'info'   : '#e91e63',
         'success': '#c3ffc5',
         'comment': '#ffffff',
         'carbun' : '#eeeeee'
      }
      $log.append(`<p style='color: ${scheme[type]}'>${message}</p>`);
      carbun.log.push(carbun.currentInputPure);
      carbun.logIndex = carbun.log.length - 1;
   },
   parse: () => {
      carbun.currentInputParsed  = '';
      [...carbun.currentInputPure].forEach((char, index) => {
         carbun.currentInputParsed += `<span class='char ${carbun.caretPosition - 1 === index ? 'selected' : ''}' data-index='${index}'>${char}</span>`;
      });
      carbun.update();
      if (carbun.caretPosition === 0) {
         $('.helper').addClass('shine');
      } else {
         $('.helper').removeClass('shine');
      }
   },
   update: () => {
      $line.html(`<span class='helper'>: </span>` + carbun.currentInputParsed);
      return;
   }
};

$('body').on('click', '.exe', function() {
   const cmd = $(this).text().toLowerCase();
   carbun.exec(cmd)
});

$(document).ready(() => {
   // capture key pressed
   $('body').keydown(e => {
      const key = e.key;
      if (key.length === 1 && !e.ctrlKey) {
         carbun.insert(key);
      } else {
         (carbun.specialFunctions[key] || (()=>{}))(e.ctrlKey, e.shiftKey);
      }
   });
});

$(document).on({
   "contextmenu": function(e) {
      e.preventDefault();
   },
   "mousedown": async function(e) { 
      if (e.which === 3) {
         const text = await navigator.clipboard.readText();
         carbun.currentInputPure += text;
         carbun.caretPosition += text.length;
         carbun.parse();
      } 
   }
});
carbun.parse();
carbun.echo(`Welcome to carbun - version ${carbun.version}`, 'carbun');
carbun.echo(`Crafted with <span style='color: red'>❤</span> by 0utlandish.`, 'carbun');
carbun.echo(`You can type a command and press <span class='botton'>ENTER</span> or click on the commands with <u>underline</u> to run them.`, 'carbun');
carbun.echo(`Enter <span class='exe'>help</span> to get started !`, 'carbun');
