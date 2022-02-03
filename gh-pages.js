let ghpages = require('gh-pages');

ghpages.publish(
    'public',
    {
        branch: 'gh-pages',
        repo: 'https://github.com/Birklehof/Art-Gallery.git',
        user: {
            name: 'Paul Maier',
            email: 'pauljustus279@gmail.com'
        },
        dotfiles: true
    },
    () => {
        console.log('Deploy Complete!')
    }
)