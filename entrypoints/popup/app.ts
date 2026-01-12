import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-root',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'block p-4' },
    template: `                                                                         
      <h1 class="text-lg font-bold">Hello from Angular!</h1>                            
    `,
})
export class App { }  