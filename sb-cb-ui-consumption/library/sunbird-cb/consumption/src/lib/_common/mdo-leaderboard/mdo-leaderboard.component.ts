import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InsiteDataService } from '../../_services/insite-data.service';

@Component({
  selector: 'sb-uic-mdo-leaderboard',
  templateUrl: './mdo-leaderboard.component.html',
  styleUrls: ['./mdo-leaderboard.component.scss']
})
export class MdoLeaderboardComponent implements OnInit {

  currentTab: any = 'XL'
  result: any = []
  filteredData: any
  searchTerm: string = ''
  expand: boolean = true

  @Input() object: any
  @Output() tabClicked = new EventEmitter<any>()
  constructor(private insiteDataService: InsiteDataService) { }

  ngOnInit() {
    this.getData()
  }

  getData() {
    this.insiteDataService.fetchLeaderboard().subscribe((res: any) => {
        if (res && res.result) {
            this.result = res.result
            this.filteredData = this.result.mdoLeaderBoard
                .filter(user => user.size === this.currentTab) 
                .map(user => ({ ...user, children: [], selected: false })).slice(0, 5)
        }
        
    }, error => {
        console.log(error)
    })
  }

  getTabData(name: any) {
    this.currentTab = name
    this.searchTerm = ''
    this.filteredData = this.result.mdoLeaderBoard
        .filter(user => user.size === this.currentTab) 
            .map(user => ({ ...user, children: [], selected: false })).slice(0, 5)
    let nameStr: any = ''
    switch (name) {
      case 'XL':
        nameStr = 'greater-than-50K'
        break
      case 'L':
        nameStr =  '10K-50K'
        break
      case 'M':
        nameStr =  '1K-10K'
        break
        case 'S':
          nameStr = '500-1K'
          break
      default:
        nameStr = 'less-than-500'
        break
    }
    this.tabClicked.emit(nameStr)
  }

  getRank(rank: number) {
    return [1,2,3].includes(rank) ? `rank${rank}` : 'rank0'
  }

  getMedal(rank: number) {
    if (rank === 1) {
        return 'assets/images/national-learning/Medal1.svg'
    } else if(rank === 2) {
        return 'assets/images/national-learning/Medal2.svg'
    } else {
        return 'assets/images/national-learning/Medal3.svg'
    }
  }

  handleSearchQuery(e: any) {
    if (e.target.value && e.target.value.length > 0) {
        this.searchTerm = e.target.value
        this.filteredData = this.result.mdoLeaderBoard
            .filter(user => user.size === this.currentTab && user.org_name.toLowerCase().includes(e.target.value))
            .map(user => ({ ...user, children: []})).slice(0, 5)
    } else {
        this.filteredData = this.result.mdoLeaderBoard
            .filter(user => user.size === this.currentTab)
            .map(user => ({ ...user, children: []})).slice(0, 5)
    }
  }

  toggleWeekHightlits() {
    this.expand = !this.expand
  }

}
