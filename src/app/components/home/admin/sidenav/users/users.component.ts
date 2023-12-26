import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from '../sidenav.component';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from './users.service';
import { PageEvent } from '@angular/material/paginator';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, SidenavComponent, MatIconModule, SpinnerComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  response: any;
  users = [];
  hide: boolean;
  length = 50;
  pageIndex = 0;
  pageSize = 5;
  pageEvent?: PageEvent;
  pageSizeOptions = [5, 10, 25];
  isLoading = true;

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((res) => {
      this.response = res;
      for (let i = 0; i < this.response.users.length; i++) {
        this.users.push(i);
      }
      this.isLoading = false;
    });
  }

  onDelete(indexUser: number) {
    this.response.users[indexUser].hide = true;
    const user = this.response.users[indexUser];
    this.userService.deleteUser(user).subscribe();
  }
}
