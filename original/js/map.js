
let taiwanCounty = [];
let themeAndCountyData = []; // 先選主題再選縣市的資料，假資料
let themeData = []
let chooseCountyFirstData = []; // 先選縣市再選主題的資料
let chosenTheme = ''; // 點擊選到的主題
let isMainTopicSelected = false; // 判斷目前是先點選主題或縣市
let singleSelectedCounty = ''; // 先選縣市時，目前選取縣市
let countyFirstEnabled = true // 以螢幕寬度判斷是否啟用 chooseCountyFirst 方法
let selectedCities = []; //紀錄該主題的縣市有哪些
let isAllCounty = false; // 現在選到的是否為全國
let subjectId = 0; // 主題 id
let themeAndResult = [] // 依縣市取得主題和成果列表
let mobileCounty = ''; // 手機版選取的縣市

const themeSelect = document.querySelector('.theme-select');
const countySelect = document.querySelector('.county-select');
const themeFirstArea = document.querySelector('.theme-first-area');
const countyFirstArea = document.querySelector('.no_begin');
const exploreMapSvg = d3.select('svg.explore-map');
const exploreMapArea = document.querySelector('.explore-map');
const mapThemeLocation = document.querySelector('.map_location');
const mobileCountySelected = document.querySelector('.city_select');
const baseUrl = window.location.origin;
const countyName = d3.select(`g`);
const noTheme = document.querySelector('.no-theme-text');
const mobileGuideText = document.querySelectorAll('.mobile-guide-text');
const resultThemeListTop = document.querySelector('.map_Resultslist_con')
const resultThemeList = document.querySelector('.result-theme-list')
const resultCounty = document.querySelector('h3.city_title');
const resultTheme = document.querySelector('h4.city_title2');
const mobileClearBtn = document.querySelector('.btn-mobile-clear')

// 渲染出主題 select 的 option 部分，通常會搭配 forEach 使用
// 第一個參數為主題名稱
// 第二個參數為 select 的 DOM (要將 option 寫上去的位置)
// 第三個參數是主題的 id
function createOptionDOM(theme, selectDOM, subjectId) {
  const option = document.createElement('option');
  option.textContent = theme;
  option.setAttribute('value', theme);
  option.setAttribute('data-subjectId', subjectId)
  selectDOM.appendChild(option);
}
// 渲染成果列表，參數為 forEach 的每個單項
function createResultListDOM(result, resultPid) {
  const li = document.createElement('li');
  const a = document.createElement('a');

  a.href = '';
  a.textContent = result;
  a.setAttribute('href', '../成果列表.html');
  a.setAttribute('target', '_blank');
  li.appendChild(a);
  // li.setAttribute('data-resultPid', resultPid)
  resultThemeList.appendChild(li);
}

// 取得主題列表顯示
function getTheme() {

  const data = {
    cond: { subjectid: 4, cityList: ['全國', '宜蘭縣'] }
  }

  axios({
    method: 'POST',
    url: 'https://eeis.eri.com.tw/front/EXPLORE/API/MapOperate.aspx/GetSubject',
    responseType: 'json',
    headers: {
      'content-type': 'application/json; charset=utf-8;',
    },
    data: JSON.stringify(data)
  })
  .then((res) => {
    // console.log(res.data.d.Data);
    themeAndCountyData = res.data.d.Data;
    themeAndCountyData.forEach((theme) => {
      // 渲染 select 主題列表
      createOptionDOM(theme.SubjectName, themeSelect, theme.SubjectId)
    })
  })
  .catch((err) => { 
    console.log(err);
  })
}
getTheme();

// 根據縣市取得成果列表
function getResultList(subjectId, cityList) {
  const data = {
    cond: { Subjectid: subjectId, CityList: cityList}
  }

  axios({
    method: 'POST',
    url: 'https://eeis.eri.com.tw/front/EXPLORE/API/MapOperate.aspx/GetResult',
    responseType: 'json',
    headers: {
      'content-type': 'application/json; charset=utf-8;',
    },
    data: JSON.stringify(data)
  })
  .then((res) => {
    // console.log(res);
    const resultList = res.data.d.Data;
    resultList.forEach((result) => {
      createResultListDOM(result.ResultName, result.ResultPid)
    })
  })
  .catch((err) => {
    console.log(err);
  })
}

// 先點擊縣市，依縣市取回主題和成果列表
function getThemeAndResult(city) {
  const data = {
    cond: { city: city }
  }
  axios({
    method: 'POST',
    url: "https://eeis.eri.com.tw/front/EXPLORE/API/MapOperate.aspx/GetSubjectResult",
    responseType: 'json',
    headers: {
      'content-type': 'application/json; charset=utf-8;',
    },
    data: JSON.stringify(data)
    // data: data
  })
  .then((res) => {
    // console.log(res);
    themeAndResult = res.data.d.Data;
    if (themeAndResult.length == 0) {
      
      noTheme.classList.remove('hidden');
      resultTheme.textContent = '主題：此縣市並無對應主題';
    } else {
      noTheme.classList.add('hidden');
      themeAndResult.forEach((list) => {
        createOptionDOM(list.SubjectName, countySelect);
      })
    }
  })
  .catch((err) => {
    console.log(err);
  })
}

// async function getCountyFirst() {
//   try {
//     const res = await axios.get('../json/chooseCountyFirst.json');
//     chooseCountyFirstData = res.data
//     // console.log(res);
//   } catch(err) {
//     console.log(err);
//   }
// }
// getCountyFirst();

function clearResultList() {
  // 清除前一次成果列表的顯示，會刪除第一個子節點，直到沒有子節點
  while(resultThemeList.firstChild) {
    resultThemeList.removeChild(resultThemeList.firstChild);
  };
}

// 顯示縣市文字
// 第一個參數，path 的 id；第二個參數，要顯示的縣市名稱(文字)
//state 為 true 或 false 來決定縣市文字是否顯示
function showCountyText(state) {
  exploreMapSvg.select('text')
  .classed('fill-white', state)
}



// 清除選取，清除縣市、文字、成果，回復原始狀態
function clearAllSelected() {
  // isMainTopicSelected = false;

  themeFirstArea.classList.remove('hidden');
  countyFirstArea.classList.add('hidden');
  // mapThemeLocation.classList.toggle('hidden');

  function cancelAllStyle(city) {
    if (isAllCounty) {
      exploreMapSvg.selectAll(`g[name]`)
      .selectAll('path')
      .classed('selected-fill', false)
      .style('cursor', 'default')
      .on('click', null)

      exploreMapSvg.selectAll(`text[data-county]`)
        .classed('fill-white', false)

      exploreMapSvg.selectAll('g')
        .selectAll('path')
        .style('cursor', 'pointer')
    } 
      exploreMapSvg.select(`g[name="${city}"]`)
        .selectAll('path')
        .classed('selected-fill', false)
        .style('cursor', 'default')
        .on('click', null)
  
      exploreMapSvg.select(`text[data-county="${city}"]`)
        .classed('fill-white', false)
  
      exploreMapSvg.selectAll('g')
        .selectAll('path')
        .style('cursor', 'pointer')
    
  }
  
  selectedCities.forEach((city) => {
    cancelAllStyle(city);
  })
  cancelAllStyle(singleSelectedCounty)

  // 清空前依次選取
  singleSelectedCounty = '';
  selectedCities = []; 

  
  // 清除前一次成果列表的顯示
  clearResultList();

  if (selectedCities.length === 0 ) {
    resultCounty.textContent = '縣市：請選擇縣市';
    resultTheme.textContent = '主題：請選擇主題';
  }
}

function clearMobileCountySelect() {
  // while(mobileCountySelected.firstChild.nextSibling) {
  //   mobileCountySelected.removeChild(mobileCountySelected.firstChild.nextSibling);
  // };
  while(mobileCountySelected.firstChild) {
    mobileCountySelected.removeChild(mobileCountySelected.firstChild);
  };

  const option = document.createElement('option');
  option.textContent = '請選擇縣市';
  option.setAttribute('value', '');
  mobileCountySelected.appendChild(option);
}

// 清空篩選條件的按鈕使用
function clearCondition() {
  clearAllSelected();
  isMainTopicSelected = false;
  mapThemeLocation.classList.add('hidden');

  // 手機版的縣市下拉選單清空
  if (mobileCounty) {
    clearMobileCountySelect()
  }
}

// 根據主題和縣市取得成果列表
function accordingCountyShowResultList(selected, countyName) {
  const cities = selected.CityList.includes(countyName) ? ['全國', countyName] : ['全國']
  getResultList(subjectId, cities)
}

themeSelect.addEventListener('change', chooseThemeFirst);

// 先選擇主題、再選擇縣市、最後呈現成果列表
function chooseThemeFirst(e) {
  isMainTopicSelected = true;
  chosenTheme = e.target.value;

  // 取出選取的 option dom、取出 data-subjectId
  const selectedOption = themeSelect.options[themeSelect.selectedIndex]
  subjectId = selectedOption.getAttribute("data-subjectId");

  // 清除全部選取，回復原始狀態
  clearAllSelected();

  //選擇主題後就先顯示主題
  resultTheme.textContent = `主題：${chosenTheme}`; 
  
  // 選擇新的城市
  const selected = themeAndCountyData.find((county) => {
    return county.SubjectName === chosenTheme;
  })

  // 先將所有縣市的指標效果設為預設
  exploreMapSvg.selectAll('g[name]')
  .selectAll('path')
  .style('cursor', 'default');

  // 再根據不同縣市去調整調色和顯示成果列表 
  selected.CityList.forEach((city, i) => {    
    if (selected.CityList.includes('全國')) {
      isAllCounty = true;
      exploreMapSvg.selectAll('g[name]')
        // .select('path')
        .selectAll('path')
        .classed('selected-fill', true)
        .style('cursor', 'pointer')
        .on('click', (e, d) => {
          if (window.innerWidth < 950) return;
          const pathId = d3.select(e.target).attr('id')
          const countyName = d3.select(`g#${pathId}`).attr('name'); 
          resultCounty.textContent = `縣市：${countyName}`;

          // 清除前一次成果列表的顯示
          clearResultList();

          // 判斷點擊的縣市，呈現成果列表
          if (selected.CityList.includes('全國') && selected.CityList.length > 1) {
            accordingCountyShowResultList(selected, countyName)
            // if (selected.CityList.includes(countyName)) {
            //   getResultList(subjectId, ['全國', countyName]);
            //   console.log(['全國', countyName]);
            // } else {
            //   getResultList(subjectId, ['全國']);
            //   console.log(['全國']);
            // }            
          } 
        })
      
        exploreMapSvg.selectAll('text')
        .classed('fill-white', true)

    } else {
      exploreMapSvg.select(`g[name="${city}"]`)
      // .select('path')
      .selectAll('path')
      .classed('selected-fill', true)
      .style('cursor', 'pointer')
      .on('click', (e, d) => {
        if (window.innerWidth < 950) return;
        resultCounty.textContent = `縣市：${city}`;

        // 清除前一次成果列表的顯示
        clearResultList();
        // 依縣市顯示成果列表，主題 > 縣市 > 成果列表
        getResultList(subjectId, [city])
        // console.log([city]);
      })

      // 顯示縣市文字
      const textElement = exploreMapSvg.selectAll(`text[data-county = ${city}]`)
      textElement.classed('fill-white', true)
    }
    selectedCities.push(city);
  })

 
  // 手機版，顯示縣市選單、點選滑動到指定位置
  if (window.innerWidth < 950) {
    mobileScrollManner(selected, selectedCities, subjectId);
  }
}

// let mobileCounty = ''
let mobileUseSelected = {};
// 手機版，顯示縣市選單、點選滑動到指定位置
function mobileScrollManner(selected, selectedCities, subjectId) {
  mobileUseSelected = selected
  clearMobileCountySelect();

  //渲染下拉選單
  selectedCities.forEach((city) => {
    if (selectedCities.includes('全國')) {
      taiwanCounty.forEach((city) => {
        createOptionDOM(city.county, mobileCountySelected)
      })
    }
    createOptionDOM(city, mobileCountySelected)
  });

  mobileCountySelected.removeEventListener('change', handleMobileCountyChange);
  
  // 下拉選單選擇不同縣市，顯示不同 result list
  mobileCountySelected.addEventListener('change', handleMobileCountyChange);
}

function handleMobileCountyChange(e) {
  mobileCounty = e.target.value;
  resultCounty.textContent = `縣市：${mobileCounty}`;

  if (window.innerWidth < 950 && mobileCounty) {
    setTimeout(() => {
      resultThemeListTop.scrollIntoView({ behavior: 'smooth'})
    }, 100)
  }

  clearResultList();

  console.log(mobileUseSelected);
  if (mobileUseSelected.CityList.includes('全國') && mobileUseSelected.CityList.length > 1) {
    accordingCountyShowResultList(mobileUseSelected, mobileCounty)
    // if (mobileUseSelected.CityList.includes(mobileCounty)) {
    //   getResultList(subjectId, ['全國', mobileCounty]);
    //   console.log(subjectId, ['全國', mobileCounty]);
    // } else {
    //   getResultList(subjectId, ['全國']);
    //   console.log(subjectId, ['全國']);
    // }            
  } else {
    getResultList(subjectId, [mobileCounty]);
    // console.log(subjectId, [mobileCounty]);
  } 
}


// 手機版 選擇相關選像，滑動到對應區塊
const screenWidth = window.innerWidth;

themeSelect.addEventListener('change', () => {
  if (window.innerWidth < 950) {
    setTimeout(() => {
      mobileCountySelected.scrollIntoView({ behavior: 'smooth'})

    }, 100)
  }
})


mobileClearBtn.addEventListener('click', (e) => {
  if (window.innerWidth < 950) {
    const scrollElement = document.documentElement || document.body;
    scrollElement.scrollIntoView(true)
  }
})


// 監聽螢幕寬度改變，取消先選擇城市的功能
function handleResizeScreen() {
  if (window.innerWidth < 950) {
    mobileGuideText.forEach(element => {
      element.classList.remove('hidden');
    })
    exploreMapArea.classList.add('hidden');
    countyFirstEnabled = false;
    chooseCountyFirst();

  } else {
    mobileGuideText.forEach(element => {
      element.classList.add('hidden');
    })
    exploreMapArea.classList.remove('hidden');
    countyFirstEnabled = true;
    chooseCountyFirst();
  }
  
}

// 縣市篩選的情況下，依點擊到的主題呈現成果列表
function showCountyFirstResultList(e) {
  let singleCountyTheme = e.target.value;
  resultTheme.textContent = `主題：${singleCountyTheme}`;


  clearResultList();
  const resultList = themeAndResult.find((item) => {
    return item.SubjectName === singleCountyTheme;
  });

  resultList.ResultList.forEach((result) => {
    createResultListDOM(result.ResultName);
  })
}

// 依縣市篩選，先選縣市再選主題
function chooseCountyFirst() {
  if (!countyFirstEnabled) return;

  let preCountyName = '';
  let prePathId = '';
  
  exploreMapSvg.selectAll('g')
  .style('cursor', 'pointer')
  .on('click', (e, d) => {
    if (isMainTopicSelected) return;

    clearResultList();
    resultTheme.textContent = '主題：請選擇主題';
    themeFirstArea.classList.add('hidden');
    countyFirstArea.classList.remove('hidden');
    chosenTheme = '';
    // themeFirst = false;

    const pathId = d3.select(e.target).attr('id')
    const countyName = d3.select(`g#${pathId}`).attr('name');
    singleSelectedCounty = countyName;
    resultCounty.textContent = `縣市：${countyName}`;

    // 清除前一個縣市的主題列表
    while(countySelect.firstChild) {
      countySelect.removeChild(countySelect.firstChild);
    };

    // 點擊的 path 顯示區塊顏色和文字
    if (preCountyName) {
      exploreMapSvg.select(`path#${prePathId}`)
        .classed('selected-fill', false);
      exploreMapSvg.select(`text[data-county=${preCountyName}]`)
        .classed('fill-white', false);
    }

    exploreMapSvg.select(`path#${pathId}`)
      .classed('selected-fill', true);
    exploreMapSvg.select(`text[data-county=${countyName}]`)
      .classed('fill-white', true);

    preCountyName = countyName; 
    prePathId = pathId;

    // 點擊後，顯示對應縣市的 div 主題列表
    const areaXY = e.target.getBBox();
    let xPosition = 0;
    let yPosition = 0;
    const mapLocationDiv = d3.select('.map_location')

    // 位置微調
    if (screenWidth < 1184) {
      const rect = e.target.getBoundingClientRect();
      xPosition = rect.x + rect.width / 2 - 500;
      yPosition = rect.y + rect.height / 1.8 + 35 - 100;
    } 
    else {
      xPosition = areaXY.x + areaXY.width / 2;
      yPosition = areaXY.y + areaXY.height / 1.8 + 35;
    }

    mapLocationDiv
      .style('left', `${xPosition}px`)
      .style('top', `${yPosition}px`)
      .classed('hidden', false)

    
    // 依據縣市資料渲染出主題選單
    // clickCounty.themesList.forEach((theme) => {
    //   createOptionDOM(theme.theme, countySelect);
    // })
    getThemeAndResult(countyName);


    // 監聽被點擊到的縣市，依主題呈現成果列表
    countySelect.addEventListener('click', showCountyFirstResultList)

  })
  .on('mouseover', (e, d) => {
    if (isMainTopicSelected) return;
    // console.log(e);
    const pathId = d3.select(e.target).attr('id');
    const countyName = d3.select(`g#${pathId}`).attr('name');
    // 滑鼠滑到縣市，縣市填色、加文字
    handleCountyHover(pathId, countyName)
  })
  .on('mouseleave' ,(e, d) => {
    if (isMainTopicSelected) return;
    const pathId = d3.select(e.target).attr('id');
    const countyName = d3.select(`g#${pathId}`).attr('name');
    // 滑鼠離開，取消填色和文字
    handleMouseLeave(pathId, countyName)
  })
}

// 滑鼠滑到縣市，縣市填色、加文字
function handleCountyHover(pathId, countyName) {
  d3.select(`g#${pathId}`)
      .selectAll('path')
      .classed('selected-hover', true)      

  d3.select(`text[data-county=${countyName}]`)
    .classed('fill-white', true);
}

function handleMouseLeave(pathId, countyName) {
  d3.select(`g#${pathId}`)
      .selectAll('path')
      .classed('selected-hover', false)

  // 如果是被點擊的狀態，就不取消文字
  if (!d3.select(`path#${pathId}`).classed('selected-fill')) {
    d3.select(`text[data-county=${countyName}]`)
      .classed('fill-white', false);
  }
}

// 初始化時先確認螢幕寬度
handleResizeScreen();
// 接著監聽螢幕變化
window.addEventListener('resize', handleResizeScreen)


// 清除所有選取的按鈕
const clearBtn = document.querySelector('.btn-gradient');
clearBtn.addEventListener('click', clearCondition);

const closeBtn = document.querySelector('.btn-close');


// 關閉依縣市出現的主題列表
closeBtn.addEventListener('click', ((e) => {
  mapThemeLocation.classList.toggle('hidden');
}))



// 取得台灣縣市列表
function getTaiwanCounty() {
  axios.get('json/taiwanCounty.json')
  .then((res) => {
    taiwanCounty = res.data

    // 顯示縣市文字
    taiwanCounty.forEach((county) => {
        // 加上縣市文字
      const countyAreaDOM = document.querySelector(`path#${county.id}`);
      const areaXY = countyAreaDOM.getBBox();
      let xPosition = areaXY.x +  areaXY.width / 2;
      let yPosition = areaXY.y + areaXY.height / 1.8;

      if (county.county === '嘉義縣') {
        xPosition = xPosition + 20;
        yPosition = yPosition + 5;
      }

      exploreMapSvg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .style("text-shadow", "1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000")
      .style('pointer-events', 'none')
      // .style('fill', 'white' )
      .classed('fill-white', false)
      .text(county.county)
      .attr('x', xPosition)
      .attr('y', yPosition)
      .attr('data-county', (d) => {
        return county.county
      })
    })

  })
  .catch((err) => {
    console.log(err);
  })
}


// 呈現台灣地圖邊框、陰影
function addMapOutline() {
  // 本島框線
  exploreMapSvg.append('image')
    .attr('width', 455)
    .attr('height', 695)
    .attr('xlink:href', 'img/map_outline2.png')
    .attr('class', 'pointer-none')
    .style('transform', 'translate(-1px, -1.5px)');

  // 本島陰影
  exploreMapSvg.select('g.map-shadow')
    .append('image')
    .attr('width', 455)
    .attr('height', 695)
    .attr('xlink:href', 'img/map_shadow.png')
    .style('transform', 'translate(10.3%, 1.7%)');

  // 外島陰影和框線
  exploreMapSvg.select('g.map-shadow-outer')
    .append('image')
    .attr('width', 102)
    .attr('height', 420)
    .attr('xlink:href', 'img/map_outline_outer.png')
    .style('transform', 'translate(0%, 1.5%)');

  // 初始化顯示縣市文字
  getTaiwanCounty();
}
addMapOutline();



