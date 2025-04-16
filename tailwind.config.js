module.exports = {
    theme: {
      extend: {
        keyframes: {
          float: {
            '0%': { opacity: 1, transform: 'translateY(0)' },
            '100%': { opacity: 0, transform: 'translateY(-20px)' },
          },
        },
        animation: {
          float: 'float 1s ease-out',
        },
      },
    },
  };
  