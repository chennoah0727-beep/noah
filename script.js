
(() => {
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => [...r.querySelectorAll(s)];

  // Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  qsa('.reveal').forEach(el => observer.observe(el));

  // Scroll progress
  const progress = qs('.scroll-progress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max ? (scrollY / max) * 100 : 0}%`;
  };
  addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  // Cursor glow on desktop
  const glow = qs('.cursor-glow');
  if (matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => {
      glow.animate(
        {left: `${e.clientX}px`, top: `${e.clientY}px`},
        {duration: 550, fill:'forwards', easing:'cubic-bezier(.2,.8,.2,1)'}
      );
    });
  } else {
    glow.style.display = 'none';
  }

  // Magnetic buttons
  if (matchMedia('(pointer:fine)').matches) {
    qsa('.magnetic').forEach(el => {
      const strength = Number(el.dataset.strength || 8);
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left+r.width/2)) / r.width;
        const dy = (e.clientY - (r.top+r.height/2)) / r.height;
        el.style.transform = `translate(${dx*strength}px, ${dy*strength}px)`;
      });
      el.addEventListener('pointerleave', () => el.style.transform = '');
    });
  }

  // Image parallax
  qsa('.parallax-image').forEach(el => {
    addEventListener('scroll', () => {
      const speed = Number(el.dataset.speed || .08);
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom > -200 && rect.top < innerHeight + 200) {
        el.style.transform = `translateY(${(innerHeight/2 - rect.top) * speed}px)`;
      }
    }, {passive:true});
  });

  // Mobile menu
  const menu = qs('.menu-button');
  const mobile = qs('.mobile-menu');
  const setMenu = (open) => {
    mobile.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    mobile.setAttribute('aria-hidden', String(!open));
  };
  menu?.addEventListener('click', () => setMenu(!mobile.classList.contains('open')));
  qsa('.mobile-menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Modal system
  const modal = qs('#modal');
  const content = qs('#modal-content');
  let musicIdx = -1;
  const MUSIC_LIST = [
    { name: '风吹过的时候', file: 'assets/music/fengchui.mp3' },
    { name: '你生而带翼', file: 'assets/music/youshengdaiyi.mp3' },
    { name: '回家', file: '' },
    { name: '光', file: '' },
    { name: '创造我的人生', file: '' }
  ];
  const WRITING_LIST = [
    { title: '为什么你越来越焦虑？', url: 'https://mp.weixin.qq.com/s/6HhCGzRWVzzyP3AFN9FXuQ' },
    { title: '你不是输给了贫穷而是没有设计自己的人生！', url: 'https://mp.weixin.qq.com/s/VjniUpUaG0qOsLqs-CoDaA' },
    { title: '你以为自己很优秀，其实是孤儿！', url: 'https://mp.weixin.qq.com/s/Vhgm_TvRoupMD4UoekLy-g' }
  ];
  const close = () => {
    const audio = qs('#music-player');
    if (audio) audio.pause();
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
  };
  const openModal = (type) => {
    const blocks = {
      los: `
        <div class="modal-eyebrow">LOS · Life Operating System</div>
        <h3>不是教你成为别人，<br>而是帮助你逐渐成为自己。</h3>
        <p>LOS 是我正在构建的一套生命成长框架。它试图把身体、心智、情绪、关系、学习、财富、事业、创造与使命放进同一个长期成长地图里。</p>
        <p>下一阶段会继续发展 LOS 商业体系、课程、测评与 AI 辅助工具，让系统从思想走向实践。</p>
        <div class="modal-tip">在这里你可以继续深入：LOS 商业体系/ 测评 / 训练营 / 个人成长报告。</div>
      `,
      education: `
        <div class="modal-eyebrow">Education · Family · Youth</div>
        <h3>教育，不只是在培养成绩。</h3>
        <p>长期与孩子、家庭和教育者一起工作，我越来越关注成长背后的生命力、关系、习惯、注意力、学习方式与人生方向。</p>
        <p>这里未来会展示家庭陪伴、青少年成长、自然教育、学习能力与生涯规划等项目。</p>
      `,
      ai: `
        <div class="modal-eyebrow">AI × Human</div>
        <h3>让 AI 成为人的“虚拟员工”。</h3>
        <p>我正在探索 AI 如何进入个人成长、教育与一人公司的真实工作流：从信息处理，到内容创作，再到行动执行与反馈。</p>
        <p>其中一个方向是 AI Action Coach——帮助“有想法的人”从想法真正进入行动。</p>
      `,
      creation: `
        <div class="modal-eyebrow">Creation · Music · Writing · Speaking</div>
        <h3>把思想，变成作品。</h3>
        <p>音乐、写作、课程、视频、演讲与产品，都是我把内在世界带进现实的方式。</p>
        <p>音乐作品包括《你生而带翼》《风吹过的时候》《光》《创造我的人生》等；这里未来会变成完整作品集。</p>
      `,
      music: `
        <div class="modal-eyebrow">MUSIC · 音乐作品</div>
        <h3>把思想，变成作品。</h3>
        <p>点击作品名称即可播放，再次点击可暂停。</p>
        <div class="music-list">
          ${MUSIC_LIST.map((m, i) => `
            <button type="button" class="music-item${m.file ? '' : ' disabled'}" data-idx="${i}"${m.file ? '' : ' disabled'}>
              <span class="music-idx">0${i + 1}</span>
              <span class="music-name">《${m.name}》</span>
              <span class="music-state">${m.file ? '<i class="music-play">▶</i>' : '即将上架'}</span>
            </button>`).join('')}
        </div>
        <audio id="music-player" class="music-player" controls preload="none"></audio>
        <div class="modal-tip">更多作品即将上架，也可以关注视频号第一时间收听。</div>
      `,
      writing: `
        <div class="modal-eyebrow">WRITING · 文章</div>
        <h3>把思想，变成作品。</h3>
        <p>精选文章，点击标题阅读公众号原文。</p>
        <div class="writing-list">
          ${WRITING_LIST.map((a, i) => `
            <a class="writing-item" href="${a.url}" target="_blank" rel="noopener">
              <span class="writing-idx">0${i + 1}</span>
              <span class="writing-name">${a.title}</span>
              <span class="writing-state">阅读 ↗</span>
            </a>`).join('')}
        </div>
        <div class="modal-tip">更多文章持续更新，欢迎关注公众号。</div>
      `,
      "article-1": `
        <div class="modal-eyebrow">LIFE / ESSAY</div>
        <h3>一个人，到底怎样才能真正成为他自己？</h3>
        <p>我们从小被成绩、学历、职业、家庭角色和别人的期待定义，却很少有人真正学习过：我是谁？我想成为什么样的人？我这一生究竟要怎么活？</p>
        <p>LOS 生命成长系统，关注的不是教你成为“更优秀的别人”，而是帮助你觉察自己、理解自己、认识自己的天赋与需要，重新建立身体、情绪、关系、认知、事业与使命之间的生命秩序。</p>
        <p>因为真正的成长，不是拥有更多，而是越来越清楚：我是谁，我要什么，我为什么而活，以及如何把想法变成真实的人生。</p>
        <p>LOS，陪你从“活着”走向“活成自己”。</p>
      `,
      "article-2": `
        <div class="modal-eyebrow">ACTION / ESSAY</div>
        <h3>为什么很多人知道，却永远无法做到？</h3>
        <p>我们并不缺知识。很多人知道应该早睡、运动、阅读、学习，也知道应该改变自己，可真正能够持续做到的人却并不多。</p>
        <p>因为知道，是认知层面的改变；做到，是整个生命系统的改变。行动不仅取决于意志力，还受到身体状态、情绪、注意力、环境、习惯以及即时反馈的影响。</p>
        <p>所以，真正的成长不是不断给自己增加知识，而是建立一套能够让认知进入行动、行动形成反馈、反馈推动迭代的系统。LOS 关注的，正是这条从“我知道”到“我做到”，再到“我成为”的完整路径。</p>
        <p>成长，不是懂得更多，而是让知道的事情真正发生在生命里。</p>
      `,
      "article-3": `
        <div class="modal-eyebrow">EDUCATION / ESSAY</div>
        <h3>教育究竟在培养什么？</h3>
        <p>如果教育只留下分数，孩子即使考上了好学校，也可能依然不知道自己是谁、喜欢什么、想去哪里，更不知道如何面对真实世界。</p>
        <p>真正的教育，不只是把知识装进孩子的大脑，更重要的是帮助一个人认识自己、发展天赋、建立思考能力、学会与人相处，并拥有面对挫折和选择人生的能力。</p>
        <p>我们希望培养的，不只是一个会考试的孩子，而是一个有生命力、有判断力、有责任感，能够认识自己、创造价值，并为自己人生负责的人。</p>
        <p>教育的终点，不是标准答案，而是一个真正能够走向世界、活出自己的人。</p>
      `,
      "article-4": `
        <div class="modal-eyebrow">AI / ESSAY</div>
        <h3>当 AI 成为每个人的“虚拟员工”，人应该做什么？</h3>
        <p>当 AI 可以帮助我们执行任务、搜索信息、整理资料，甚至完成越来越多的创作，未来真正稀缺的，可能不再只是“会做事的人”，而是知道为什么做、应该做什么，以及要创造什么的人。</p>
        <p>AI 可以替我们提高效率，却无法替我们决定人生的方向。</p>
        <p>所以，AI 时代真正需要升级的，不只是工具，而是人的判断力、创造力、审美力、关系能力与意义感。</p>
        <p>我们要学习的，不是与 AI 比谁更快，而是学会让 AI 成为自己的“虚拟员工”，把时间和生命还给真正重要的事情：思考、创造、连接、选择，并成为自己人生的主人。</p>
      `,
      journal: `
        <div class="modal-eyebrow">NOAH'S JOURNAL</div>
        <h3>思想实验室</h3>
        <p>这里会逐渐收录我关于生命、教育、行动、AI、财富、家庭与创造的长期思考。网站上线后，可以把文章卡片替换为真实文章链接或 Markdown/静态页面。</p>
        <div class="modal-tip">下一步可以把你的公众号文章、视频号内容、课程笔记批量接入这里，形成个人知识库。</div>
      `,
      connect: `
        <div class="modal-eyebrow">LET'S CONNECT</div>
        <h3>让我们建立连接。</h3>
        <p>欢迎通过以下方式找到我。</p>
        <div class="contact-qr-grid">
          <div class="contact-qr-item">
            <div class="contact-qr-img"><img src="assets/qr-wechat.webp" alt="微信二维码"></div>
            <span>微信</span>
          </div>
          <div class="contact-qr-item">
            <div class="contact-qr-img"><img src="assets/qr-gongzhonghao.webp" alt="公众号二维码"></div>
            <span>公众号</span>
          </div>
          <div class="contact-qr-item">
            <div class="contact-qr-img contain"><img src="assets/qr-shipinhao.webp" alt="视频号二维码"></div>
            <span>视频号</span>
          </div>
        </div>
        <div class="modal-tip">邮箱：<a href="mailto:1019906380@qq.com">1019906380@qq.com</a> · 欢迎来信交流</div>
      `
    };
    content.innerHTML = blocks[type] || blocks.connect;

    if (type === 'music') {
      const audio = qs('#music-player');
      const items = qsa('.music-item', content);
      const updateUI = () => {
        items.forEach((btn, i) => {
          const playing = (i === musicIdx && !audio.paused);
          btn.classList.toggle('playing', playing);
          const icon = btn.querySelector('.music-play');
          if (icon) icon.textContent = playing ? '⏸' : '▶';
        });
      };
      items.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.idx);
          if (!MUSIC_LIST[idx].file) return;
          if (musicIdx === idx && !audio.paused) {
            audio.pause();
            updateUI();
            return;
          }
          musicIdx = idx;
          audio.src = MUSIC_LIST[idx].file;
          audio.classList.add('show');
          audio.play().catch(() => {});
          updateUI();
        });
      });
      audio.addEventListener('play', updateUI);
      audio.addEventListener('pause', updateUI);
      audio.addEventListener('ended', () => {
        musicIdx = -1;
        updateUI();
      });
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
  };
  qsa('[data-open]').forEach(el => el.addEventListener('click', () => openModal(el.dataset.open)));
  qs('.modal-close').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Journal filtering
  qsa('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      qsa('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      qsa('.journal-card').forEach(card => {
        const show = (f === 'all' || card.dataset.category === f);
        card.style.display = show ? '' : 'none';
        card.classList.toggle('article-open', show && f !== 'all');
      });
      qs('.journal-grid').classList.toggle('single', f !== 'all');
    });
  });
})();
