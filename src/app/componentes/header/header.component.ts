import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/pages/servicios/theme.service';

@Component({
  selector: 'duocuc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public darkMode: boolean = true

  constructor(private theme: ThemeService) {}

  ngOnInit() {
    this.theme.darkMode$.subscribe(isDark => { this.darkMode = isDark })
  }

}
