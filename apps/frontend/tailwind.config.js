var config = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                vaquita: {
                    black: '#000000',
                    white: '#FFFFFF',
                    bg: {
                        DEFAULT: '#0A0A0A',
                        secondary: '#111111',
                        tertiary: '#1A1A1A',
                        elevated: '#1E1E1E',
                    },
                    border: {
                        DEFAULT: '#262626',
                        light: '#333333',
                        focus: '#525252',
                    },
                    text: {
                        DEFAULT: '#FAFAFA',
                        secondary: '#A3A3A3',
                        tertiary: '#737373',
                        muted: '#525252',
                    },
                    accent: {
                        DEFAULT: '#FAFAFA',
                        hover: '#E5E5E5',
                        muted: '#404040',
                    },
                    success: {
                        DEFAULT: '#22C55E',
                        muted: '#16532E',
                    },
                    warning: {
                        DEFAULT: '#EAB308',
                        muted: '#5C4B0B',
                    },
                    error: {
                        DEFAULT: '#EF4444',
                        muted: '#5C1B1B',
                    },
                    info: {
                        DEFAULT: '#3B82F6',
                        muted: '#1E3A6E',
                    },
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.2s ease-out forwards',
                slideUp: 'slideUp 0.3s ease-out forwards',
                slideDown: 'slideDown 0.3s ease-out forwards',
                scaleIn: 'scaleIn 0.2s ease-out forwards',
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'glow': '0 0 20px rgba(250, 250, 250, 0.05)',
            },
        },
    },
    plugins: [],
};
export default config;
