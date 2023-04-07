import './tailwind.css';

const aBtn = document.querySelector('#add-btn');
const dBtn = document.querySelector('#delete-btn');
const gBtn = document.querySelector('#generate-btn');

const lSelect = document.querySelector('#list-select') as HTMLSelectElement;
const content = document.querySelector('#content') as HTMLDivElement;

const resultArea = document.querySelector('#result') as HTMLTextAreaElement;

interface Data {
  type: TagType;
  value: string[];
}

type TagType = 'ul' | 'ol' | 'p';

const dataList: Data[] = [];

const onClickAddBtn = () => {
  const { value } = lSelect;

  addElement(value as TagType);
  addData(value as TagType);
};

const onClickDeleteBtn = () => {
  deleteElement();
  deleteData();
};

const addElement = (value: TagType) => {
  const wrap = document.createElement('div');
  wrap.className = 'mb-1';

  content.appendChild(wrap);

  const span = document.createElement('span');
  span.innerHTML = `⭐️ ${value}`;

  wrap.appendChild(span);
  const button = document.createElement('button');
  button.className = 'bg-pink-500 px-2 py-0 rounded-md text-white text-xs h-8';
  button.innerHTML = 'add';
  wrap.appendChild(button);

  const input = document.createElement('input');
  input.setAttribute('type', 'text');

  let placeholder;
  if (value === 'ul' || value === 'ol') {
    placeholder = 'li';
  } else {
    placeholder = value;
  }

  input.setAttribute('placeholder', `${placeholder}...`);
  input.className =
    'flex-1 border border-gray-300 rounded-md text-gray-900 px-1 h-8 w-full mb-5';

  wrap.appendChild(input);
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
    value: [''],
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

showEmpty();

const generate = () => {
  console.log(dataList);

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
      result += `&lt;${tag}&gt;${text}&lt;/${tag}&gt;\n`;
    });

	result += tag !== 'p' ? `&lt;${type}/&gt;\n` : '';
	result += `\n`;

  });


  resultArea.innerHTML = result;
};

const watch = () => {
  showEmpty();
  console.log(dataList);
};
aBtn?.addEventListener('click', onClickAddBtn);
dBtn?.addEventListener('click', onClickDeleteBtn);

aBtn?.addEventListener('click', watch);

gBtn?.addEventListener('click', generate);
