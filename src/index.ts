import './tailwind.css';

/**
 * 요소를 불러옴
 */

// 버튼
const aBtn = document.querySelector('#add-btn');
const dBtn = document.querySelector('#delete-btn');
const gBtn = document.querySelector('#generate-btn');
const cBtn = document.querySelector('#copy-btn');

// 셀렉트
const lSelect = document.querySelector('#list-select') as HTMLSelectElement;

// 콘텐츠
const content = document.querySelector('#content') as HTMLDivElement;

// 결과 출력
const resultArea = document.querySelector('#result') as HTMLTextAreaElement;

// 미리보기 출력
const preview = document.querySelector('#preview') as HTMLDivElement;

/**
 * 타입, 인터페이스
 */
interface Data {
  type: TagType;
  value: string[];
}

type TagType = 'ul' | 'ol' | 'p';

// 데이터
const dataList: Data[] = [];

/**
 * 메인 로직
 */
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const { value, dataset } = target;
  const inputIndex = Number(dataset.inputIndex);

  const parent = target.parentElement;
  const parentIndex = Number(parent?.dataset.wrapIndex);

  const selectedList = dataList[parentIndex].value;

  selectedList[inputIndex] = value;
};

const addElement = (value: TagType) => {
  const wrap = document.createElement('div');
  wrap.className = 'mb-1';
  // dataset 추가
  wrap.setAttribute('data-wrap-index', (dataList.length - 1).toString());

  content.appendChild(wrap);

  const span = document.createElement('span');
  span.className = 'mb-1';
  span.innerHTML = `⭐️ ${value}`;

  wrap.appendChild(span);

  if (value !== 'p') {
    const button = document.createElement('button');
    button.className =
      'bg-pink-500 px-2 py-0 rounded-md text-white text-xs h-8 mb-1 ml-1';
    button.innerHTML = 'add';
    wrap.appendChild(button);

    button.addEventListener('click', () => {
      addChildInput(wrap, value);
    });
  }

  addChildInput(wrap, value);
};

const addChildInput = (parentElement: HTMLElement, value: TagType) => {
  const parentIndex = Number(parentElement.dataset.wrapIndex);

  const input = document.createElement('input');
  input.setAttribute('type', 'text');

  input.addEventListener('input', handleInput);

  let placeholder;
  if (value === 'ul' || value === 'ol') {
    placeholder = 'li';
  } else {
    placeholder = value;
  }

  input.setAttribute('placeholder', `${placeholder}...`);
  input.className =
    'flex-1 border border-gray-300 rounded-md text-gray-900 px-1 h-8 w-full mb-5';

  dataList[parentIndex].value.push('');

  const inputIndex = (dataList[parentIndex].value.length - 1).toString();
  input.setAttribute('data-input-index', inputIndex);

  parentElement.appendChild(input);
};

const deleteElement = () => {
  const lastWrap = content.lastElementChild;

  if (lastWrap) {
    content.removeChild(lastWrap);
  }
};

const deleteData = () => {
  dataList.pop();
};

const addData = (value: TagType) => {
  const newData = {
    type: value,
    value: [],
  };

  dataList.push(newData);
};

const showEmpty = () => {
  const emptyMessage = document.querySelector('#empty-message');

  if (dataList.length < 1) {
    emptyMessage?.classList.remove('hidden');
  } else {
    emptyMessage?.classList.add('hidden');
  }
};

const generate = () => {
  let result = '';

  dataList.forEach((data) => {
    let tag: string = '';

    const { type, value } = data;

    switch (type) {
      case 'ul':
      case 'ol':
        tag = 'li';
        break;

      case 'p':
        tag = 'p';
      default:
        break;
    }

    result += tag !== 'p' ? `&lt;${type}&gt;\n` : '';

    value.forEach((text) => {
      result += `  &lt;${tag}&gt;${text}&lt;/${tag}&gt;\n`;
    });

    result += tag !== 'p' ? `&lt;/${type}&gt;\n` : '';
    result += `\n`;
  });

  resultArea.innerHTML = result;
};

const replaceClass = (html: string) => {
  const div = document.createElement('div');

  div.innerHTML = html;

  const ulElements = div.querySelectorAll('ul');
  for (let i = 0; i < ulElements.length; i++) {
    ulElements[i].className =
      'marker:text-sky-400 list-disc pl-5 space-y-1 text-slate-500';
  }

  const olElements = div.querySelectorAll('ol');

  for (let i = 0; i < olElements.length; i++) {
    olElements[i].className =
      'list-decimal marker:text-sky-400 pl-5 space-y-1 text-slate-500';
  }

  const pElements = div.querySelectorAll('p');

  for (let i = 0; i < pElements.length; i++) {
    pElements[i].className = 'pl-1 space-y-3 text-slate-500';
  }

  return div.innerHTML;
};

const showPreview = () => {
  const html = decodeHtml();
  const previewHtml = replaceClass(html);

  preview.innerHTML = previewHtml;
};

const decodeHtml = () => {
  const html = resultArea.innerHTML;
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const copy = async (text: string) => {
  if (!text) {
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    alert('클립보드에 복사 완료!');
  } catch (err) {
    alert('복사 실패!');
  }
};

/** 이벤트 */
const onClickAddBtn = () => {
  const { value } = lSelect;

  addData(value as TagType);
  addElement(value as TagType);
};

const onClickDeleteBtn = () => {
  deleteElement();
  deleteData();
};

const onClickGenerateBtn = () => {
  generate();
  showPreview();
};

const onClickCoptyBtn = () => {
  const text = decodeHtml();
  copy(text);
};

/** init */
showEmpty();

const watch = () => {
  showEmpty();
};

aBtn?.addEventListener('click', onClickAddBtn);
dBtn?.addEventListener('click', onClickDeleteBtn);

aBtn?.addEventListener('click', watch);
dBtn?.addEventListener('click', watch);

gBtn?.addEventListener('click', onClickGenerateBtn);

cBtn?.addEventListener('click', onClickCoptyBtn);
