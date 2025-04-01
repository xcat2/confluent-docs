
const grid = document.querySelector('.grid');
const gridcontent = {
    18: {'image': 'images/remote_management.png', 'grid': 18, 'title': 'Management'},
    10: {'image': 'images/operating-system.png', 'grid': 10, 'title': 'Desploymnent'},
    21: {'image': 'images/system_metrics.png', 'grid': 21, 'title': 'Monitoring'},
};

if (grid) {

    for (let i = 0; i < 36; i++) {
        if (gridcontent[i]) {
            grid.appendChild(generateGridCellContent(gridcontent[i]));
        } else {
            let cell = document.createElement('div');
            grid.appendChild(cell);
        }
    }
}

function generateGridCellContent(CellContent) {
    let cell = document.createElement('div');
    let img = document.createElement('img');
    cell.classList.add('icon');
    img.src = CellContent['image'];
    img.alt = CellContent['image'];
    cell.appendChild(img);

    let text = document.createElement('p');
    text.textContent = CellContent['title'];
    text.style.display = 'flex';
    text.style.justifyContent = 'center';
    text.style.alignItems = 'center';
    cell.appendChild(text);

    return cell;
}




  document.addEventListener('DOMContentLoaded', function() {
    const tocLinks = document.querySelectorAll('.toc-entry a');
    const sections = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');

    if (sections.length === 0) {
      const toc = document.querySelector('.toc-navigation');
      if (toc) {
        toc.style.display = 'none';
      }
      return;
    }

    function onScroll() {
      let currentSection = null;
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 10) {
          currentSection = section;
        }
      });

      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (currentSection && link.getAttribute('href').substring(1) === currentSection.id) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', onScroll);
  });



