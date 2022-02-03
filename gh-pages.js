let ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/Birklehof/Art-Gallery.git', // Update to point to your repository
        user: {
            name: 'Paul Maier', // update to use your name
            email: 'pauljustus279@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)