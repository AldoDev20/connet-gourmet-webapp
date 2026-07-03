import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MessageFacade } from '../../application/message/message.facade';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Chat, Message } from '../../domain/message/models/message.model';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="bg-background text-on-surface font-body-md min-h-screen flex overflow-hidden">
      <!-- Left sidebar navigation -->
      <app-sidebar></app-sidebar>

      <!-- Main messaging page split view -->
      <main class="flex-1 ml-0 lg:ml-64 flex h-screen">
        
        <!-- Conversation List Section -->
        <section class="w-full md:w-80 lg:w-96 bg-surface border-r border-outline-variant flex flex-col h-full shrink-0">
          <div class="p-6 border-b border-outline-variant/30 flex flex-col gap-4">
            <h1 class="font-headline-md text-headline-md text-on-surface font-bold">Messages</h1>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                [(ngModel)]="searchQuery"
                class="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                placeholder="Search conversations..." 
                type="text"/>
            </div>
          </div>
          
          <div class="flex-1 overflow-y-auto custom-scrollbar">
            <!-- Conversations List -->
            <ng-container *ngIf="chats$ | async as chats">
              <div 
                *ngFor="let chat of filterConversations(chats)"
                (click)="selectChat(chat)"
                [ngClass]="chat.isActive ? 'bg-secondary-container/20 border-l-4 border-primary' : 'border-b border-outline-variant/10'"
                class="p-4 flex gap-4 cursor-pointer hover:bg-secondary-container/10 transition-colors">
                
                <div class="relative shrink-0">
                  <img class="w-14 h-14 rounded-full object-cover" [alt]="chat.participantName" [src]="chat.participantAvatar"/>
                  <span 
                    class="absolute bottom-0 right-0 w-4 h-4 bg-tertiary-container border-2 border-surface rounded-full">
                  </span>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-center mb-1">
                    <span class="font-body-md font-bold text-on-surface truncate">{{ chat.participantName }}</span>
                    <span class="font-label-sm text-on-surface-variant text-xs">{{ chat.lastMessageTime }}</span>
                  </div>
                  <p class="font-body-md truncate" [ngClass]="chat.unreadCount > 0 ? 'text-on-surface font-semibold' : 'text-on-surface-variant'">
                    {{ chat.lastMessageContent }}
                  </p>
                </div>
              </div>

              <!-- Empty state -->
              <div *ngIf="chats.length === 0" class="p-8 text-center text-outline-variant">
                No active conversations
              </div>
            </ng-container>
          </div>
        </section>

        <!-- Chat History View -->
        <section class="hidden md:flex flex-1 flex-col h-full bg-surface-container-lowest">
          <ng-container *ngIf="activeChat$ | async as chat; else noActiveChat">
            <!-- Chat Header -->
            <header class="h-20 px-8 flex items-center justify-between border-b border-outline-variant/30 bg-surface z-10 shadow-sm">
              <div class="flex items-center gap-4">
                <img class="w-12 h-12 rounded-full object-cover" [alt]="chat.participantName" [src]="chat.participantAvatar"/>
                <div class="flex flex-col">
                  <span class="font-body-lg font-bold text-on-surface">{{ chat.participantName }}</span>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-tertiary-container"></span>
                    <span class="font-label-sm text-tertiary-container">Online Now</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button (click)="makeCall()" class="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors active:scale-95">
                  <span class="material-symbols-outlined">call</span>
                </button>
                <button (click)="makeVideo()" class="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors active:scale-95">
                  <span class="material-symbols-outlined">videocam</span>
                </button>
                <button (click)="showInfo()" class="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors active:scale-95">
                  <span class="material-symbols-outlined">info</span>
                </button>
              </div>
            </header>

            <!-- Message bubble container -->
            <div 
              #scrollContainer
              class="flex-1 overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] bg-fixed">
              
              <div class="flex justify-center">
                <span class="px-4 py-1 bg-surface-container text-on-surface-variant text-label-sm rounded-full">CONVERSATION</span>
              </div>

              <!-- Message History list -->
              <ng-container *ngIf="messages$ | async as messages">
                <div 
                  *ngFor="let msg of messages"
                  [ngClass]="msg.senderId === 'chef-gaston' ? 'self-end items-end flex-col' : 'self-start items-start gap-3 flex'"
                  class="max-w-[80%] flex">
                  
                  <!-- Receiver Avatar -->
                  <img 
                    *ngIf="msg.senderId !== 'chef-gaston'"
                    class="w-8 h-8 rounded-full object-cover mb-2 shrink-0" 
                    [alt]="chat.participantName" 
                    [src]="chat.participantAvatar"/>
                  
                  <div class="flex flex-col gap-1">
                    <div 
                      [ngClass]="msg.senderId === 'chef-gaston' 
                        ? 'bg-secondary text-on-secondary chat-bubble-sender rounded-2xl rounded-br-none' 
                        : 'bg-surface shadow-md border border-outline-variant/30 text-on-surface chat-bubble-receiver rounded-2xl rounded-bl-none'"
                      class="p-4 font-body-md">
                      {{ msg.content }}
                    </div>
                    <span 
                      [ngClass]="msg.senderId === 'chef-gaston' ? 'self-end mr-1' : 'self-start ml-1'"
                      class="text-label-sm text-on-surface-variant text-xs">
                      {{ msg.timestamp }}
                    </span>
                  </div>
                </div>
              </ng-container>
            </div>

            <!-- Footer Message Input Bar -->
            <footer class="p-6 border-t border-outline-variant/30 bg-surface flex items-center gap-4">
              <button class="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
                <span class="material-symbols-outlined">attach_file</span>
              </button>
              <input 
                [(ngModel)]="newMessage"
                (keyup.enter)="sendMsg()"
                class="flex-1 bg-surface-container-low border border-outline-variant rounded-full px-6 py-3 text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                placeholder="Type your message here..." 
                type="text"/>
              <button 
                (click)="sendMsg()"
                [disabled]="!newMessage.trim()"
                class="w-12 h-12 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0">
                <span class="material-symbols-outlined">send</span>
              </button>
            </footer>
          </ng-container>

          <ng-template #noActiveChat>
            <div class="flex-1 flex flex-col items-center justify-center p-8 text-center text-outline-variant bg-surface-container-lowest">
              <span class="material-symbols-outlined text-6xl mb-4">chat</span>
              <h3 class="font-headline-md font-bold mb-2">Select a Conversation</h3>
              <p class="max-w-xs text-sm">Choose a contact on the left side menu to start coordinating recipes and direct ingredient orders.</p>
            </div>
          </ng-template>
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MessagingComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private myScrollContainer!: ElementRef;

  searchQuery = '';
  newMessage = '';

  chats$: Observable<Chat[]>;
  activeChat$: Observable<Chat | null>;
  messages$: Observable<Message[]>;

  constructor(private messageFacade: MessageFacade) {
    this.chats$ = this.messageFacade.chats$;
    this.activeChat$ = this.messageFacade.activeChat$;
    this.messages$ = this.messageFacade.messages$;
  }

  ngOnInit(): void {
    this.messageFacade.loadChats();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  selectChat(chat: Chat): void {
    this.messageFacade.selectChat(chat);
  }

  sendMsg(): void {
    if (!this.newMessage.trim()) return;
    this.messageFacade.sendMessage(this.newMessage.trim());
    this.newMessage = '';
  }

  filterConversations(chats: Chat[]): Chat[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return chats;
    return chats.filter(c => 
      c.participantName.toLowerCase().includes(q) || 
      c.lastMessageContent.toLowerCase().includes(q)
    );
  }

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  makeCall(): void {
    alert('Connecting voice call service... (Mock interface)');
  }

  makeVideo(): void {
    alert('Connecting video call service... (Mock interface)');
  }

  showInfo(): void {
    alert('Contact details:\nDirect message channel verified with chef certificate.');
  }
}
