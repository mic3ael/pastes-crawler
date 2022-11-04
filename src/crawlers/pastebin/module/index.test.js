const moduleInit = require('./index');

const MOCK_DATE = 1667591080481;

jest.mock('moment', () => {
  const mMoment = {
    subtract: jest.fn().mockReturnThis(),
    valueOf: jest.fn(() => MOCK_DATE),
  };
  const fn = jest.fn(() => {
    return mMoment;
  });
  return fn;
});

describe('module', () => {
  let module;
  beforeEach(() => {
    module = moduleInit();
  });
  describe('pastes', () => {
    test('success', () => {
      const html = `
            <ul class="sidebar__menu li">
                <li>
                    <a href="/avc">My Code</a>
                    <div class="details">
                        HTML 5 | 13 min ago | 3.52 KB 
                    </div>
                </li>
                <li>
                    <a href="/sdas">My Code2</a>
                    <div class="details">
                       C# | 15 min ago | 1.1 KB
                    </div>
                </li>
            <ul>
        `;
      const pastes = module.pastes(html);
      expect(pastes.length).toBe(2);
      expect(pastes).toMatchObject([
        {
          title: 'My Code',
          date: MOCK_DATE,
          type: 'HTML 5',
          id: 'avc',
          size: '3.52 KB',
        },
        {
          title: 'My Code2',
          date: MOCK_DATE,
          type: 'C#',
          id: 'sdas',
          size: '1.1 KB',
        },
      ]);
    });
    test('empty', () => {
      const html = ``;
      const pastes = module.pastes(html);
      expect(pastes.length).toBe(0);
    });
    //not testing error input because want to get lambda errors in a case of pastebin dom change
  });
  describe('past', () => {
    test('success', () => {
      const username = 'PowerCell46';
      const html = `
        <body>
            <div class="username"><a href="/u/PowerCell46">${username}</a></div>
            <div class="highlighted-code">
                <div class="source">
                    counter = 0;
                    console.log(print);
                </div>
            </div>
        </body>
    `;

      const past = module.past(html);
      expect(past.author).toBe(username);
      expect(past.source).toMatchSnapshot();
    });
    test('empty', () => {
      const html = ``;
      const past = module.past(html);
      expect(past.author).toBe('');
      expect(past.source).toBe('');
    });
  });
});
