let taiwanCounty = [];
let themeAndCountyData = []; // 顯示主題選單、對應縣市
let chosenTheme = ''; // 選擇的主題
let subjectId = 0;
let selectedCities = []; // 目前的主題，被選到的縣市有哪些
let isAllCounty = false; // 現在選到的是否為全國
let mobileCounty = ''; // 手機版選取的縣市
// let singleSelectedCounty = ''; // 先選縣市時，目前選取縣市

const exploreMapSvg = d3.select('svg.explore-map');
const exploreMapArea = document.querySelector('.explore-map');
const themeEventSelect = document.querySelector('.theme_event_select');
const chooseHintText = document.querySelector('.choose-hint-text');
const eventResultContent = document.querySelector('.event-result-content');
const chosenCountyText = document.querySelector('h3.city_title');
const chosenThemeText = document.querySelector('h4.city_title2');
const chosenImg = document.querySelector('.event-img');
const chosenContentText = document.querySelector('.event-content');
const mobileCountySelected = document.querySelector('.event-city-select');
const resultThemeListTop = document.querySelector('.map_Resultslist_con_activity');
const mobileCountySelectArea = document.querySelector('.mobile-county-select-area');
const arrowToTop = document.querySelector('.arrow-to-top');



// 顯示 select 主題部分，第一個參數為要顯示的文字 (forEach 渲染列表的參數
// 第二個參數為 select 的 DOM (要將 option 寫上去的位置)
// 第三個參數是主題的 id
// 渲染 select 裡的 option 出來
function createOptionDOM(theme, selectDOM, subjectId) {
  const option = document.createElement('option');
  option.textContent = theme;
  option.setAttribute('value', theme);
  option.setAttribute('data-subjectId', subjectId)
  selectDOM.appendChild(option);
}

function clearResultList() {
  eventResultContent.classList.add('hidden');
  chooseHintText.classList.remove('hidden')
  chooseHintText.textContent = '請接著選擇縣市'

}

// 主要為了清除 g 標籤內的填色狀態
function resetSelection(element) {
  element
    .classed('selected-fill', false)
    .style('cursor', 'default')
    .on('click', null)
}
// 清除 g 標籤(各縣市區塊)的填色和文字顯示
function cancelAllStyle(city) {
  if (isAllCounty) {
    exploreMapSvg.selectAll(`g[name]`)
    .selectAll('path')
    .call(resetSelection)

    exploreMapSvg.selectAll(`text[data-county]`)
      .classed('fill-white', false)

  } else {
    exploreMapSvg.select(`g[name="${city}"]`)
      .selectAll('path')
      .call(resetSelection)

    exploreMapSvg.select(`text[data-county="${city}"]`)
      .classed('fill-white', false)
  }

  exploreMapSvg.selectAll('g')
    .selectAll('path')
    .style('cursor', 'pointer') 
}



// 清除選取，清除縣市、文字、成果，回復原始狀態
function clearAllSelected() {
  selectedCities.forEach((city) => {
    cancelAllStyle(city);
  })

  // 清空前依次選取
  selectedCities = []; 

  // 清除前一次成果列表的顯示
  clearResultList();
}

// 清除手機版的成果
function clearMobileCountySelect() {
  // 清除手機版縣市選單
  while(mobileCountySelected.firstChild) {
    mobileCountySelected.removeChild(mobileCountySelected.firstChild);
  };
  clearResultList();
  const option = document.createElement('option');
  option.textContent = '請選擇縣市';
  option.setAttribute('value', '');
  mobileCountySelected.appendChild(option);
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
    // data: data
  })
  .then((res) => {
    // console.log(res.data.d.Data);
    themeAndCountyData = res.data.d.Data;
    themeAndCountyData.forEach((theme) => {
      // 渲染 select 主題列表
      createOptionDOM(theme.SubjectName, themeEventSelect, theme.SubjectId)
    })
  })
  .catch((err) => { 
    console.log(err);
  })
}
getTheme();


// 根據縣市取得成果列表
function getResultList(subjectId, cityList, countyName) {
  const data = {
    cond: { subjectid: subjectId, CityList: cityList}
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
    const resultList = res.data.d.Data;
    chosenCountyText.textContent = `${countyName}`;
    chosenImg.setAttribute('src', 'img/F7F8D268.png');
    chosenImg.setAttribute('alt', chosenTheme);
    chosenThemeText.textContent = `${ chosenTheme }`;
    chosenContentText.textContent = `縣市內容，到時依 API 呈現。 \n路透社根據未證實的影片顯示，位於赫松州卡科夫卡（Kakhovka）水壩附近發生一連串的爆炸，另有影片顯示，大水從水壩破口湧出，十分驚人。

    根據路透社，赫松州州長普羅克丁（Oleksandr Prokudin）台灣時間中午11時45分在通訊軟體平台Telegram上表示，5個小時內水位危急，已經下令民眾撤離。
    
    卡科夫卡水壩高30公尺、長3.2公里，1965年建造在聶伯河上，是當地水力發電廠的一部分。該水壩有18立方公里的儲水區，供水至俄國在2014年吞併的克里米亞半島，以及目前由俄國控制的札波羅熱核電廠
    
    烏克蘭軍方指控，是俄軍炸了水壩。烏克蘭軍方南區指揮部在臉書上表示，「卡科夫卡水壩被佔領的俄國軍隊轟炸」，「正在清查破壞的規模、水速和水量，可能淹沒的地區」。俄媒俄新社（RIA）則表示，俄國控制的大壩遭到砲彈襲擊。
    
    新卡科夫卡（Nova Kakhovka）俄植官員表示，水壩遭破壞會影響克里米亞半島的供水。RIA引述俄國政府緊急部門的說法指出，將有約80個定居區受到影響。`;

    chooseHintText.classList.add('hidden');
    eventResultContent.classList.remove('hidden');
  })
  .catch((err) => {
    console.log(err);
  })
}


themeEventSelect.addEventListener('change', chooseTheme)

function chooseTheme(e) {
  chosenTheme = e.target.value;

  // 取出選取的 option dom、取出 data-subjectId
  const selectedOption = themeEventSelect.options[themeEventSelect.selectedIndex]
  subjectId = selectedOption.getAttribute("data-subjectId");

  // 清除全部選取，回復原始狀態
  clearAllSelected();

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
          // if (screenWidth < 950) return;
          const pathId = d3.select(e.target).attr('id')
          const countyName = d3.select(`g#${pathId}`).attr('name'); 

          // 清除前一次成果列表的顯示
          clearResultList();

          // 判斷點擊的縣市，呈現成果列表
          if (selected.CityList.includes('全國') && selected.CityList.length > 1) {
            if (selected.CityList.includes(countyName)) {
              getResultList(subjectId, ['全國', countyName], countyName);
              // console.log(['全國', countyName]);
            } else {
              getResultList(subjectId, ['全國'], countyName);
              // console.log(['全國']);
            }            
          } 
        })
      
        exploreMapSvg.selectAll('text')
        .classed('fill-white', true)

    } else {
      exploreMapSvg.select(`g[name="${city}"]`)
      .selectAll('path')
      .classed('selected-fill', true)
      .style('cursor', 'pointer')
      .on('click', (e, d) => {
        if (window.innerWidth < 950) return;

        // 清除前一次成果列表的顯示
        clearResultList();
        // 依縣市顯示成果列表，主題 > 縣市 > 成果列表
        getResultList(subjectId, [city], city)
        // console.log([city]); 
      })

      // 顯示縣市文字
      const textElement = exploreMapSvg.selectAll(`text[data-county = ${city}]`)
      textElement.classed('fill-white', true)
    }

    selectedCities.push(city);
  })

  // 手機版，顯示縣市選單、點選滑動到指定位置
  mobileScrollManner(selected, selectedCities, subjectId);
}

// 顯示縣市選單、點選滑動到指定位置
function mobileScrollManner(selected, selectedCities, subjectId) {
  // clearResultList()
  clearMobileCountySelect();

  //渲染下拉選單
  selectedCities.forEach((city) => {
    if (selectedCities.includes('全國')) {
      taiwanCounty.forEach((city) => {
        createOptionDOM(city.county, mobileCountySelected)
      })
    }
    createOptionDOM(city, mobileCountySelected)
  })
  
  // 下拉選單選擇不同縣市，顯示不同 result list
  const screenWidth = window.innerWidth;
  //手機版選單切換的時候
  mobileCountySelected.addEventListener('change', (e) => {
    mobileCounty = e.target.value;
    chosenCountyText.textContent = `縣市：${mobileCounty}`;

    if (screenWidth < 950 && mobileCounty) {
      resultThemeListTop.scrollIntoView({ behavior: 'smooth'})
    }

    clearResultList();

    if (selected.CityList.includes('全國') && selected.CityList.length > 1) {
      if (selected.CityList.includes(mobileCounty)) {
        getResultList(subjectId, ['全國', mobileCounty], mobileCounty);
        // console.log(['全國', mobileCounty]);
      } else {
        getResultList(subjectId, ['全國'], mobileCounty);
        // console.log(['全國']);
      }            
    } else {
      getResultList(subjectId, [mobileCounty], mobileCounty);
    } 

  })
}

function handleResizeScreen() {
  if (window.innerWidth < 950) {
    mobileCountySelectArea.classList.remove('hidden');
    arrowToTop.classList.remove('hidden');
    exploreMapArea.classList.add('hidden');
    
  } else {
    mobileCountySelectArea.classList.add('hidden');
    arrowToTop.classList.add('hidden');
    exploreMapArea.classList.remove('hidden');
    exploreMapSvg.selectAll('g[name]')
      .selectAll('path')
      .style('cursor', 'default');
  }
}

// 初始化時先確認螢幕寬度
handleResizeScreen();
// 接著監聽螢幕變化
window.addEventListener('resize', handleResizeScreen)


function backToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
arrowToTop.addEventListener('click', backToTop)

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



