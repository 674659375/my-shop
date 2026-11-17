<body className="min-h-screen flex flex-col">
        <button
          onClick={() => { document.documentElement.classList.toggle('dark'); }}
          style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 999, padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc', background: 'var(--bg-color)', color: 'var(--text-color)', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
        >
          🌓 切换模式
        </button>
        {children}
      </body>
