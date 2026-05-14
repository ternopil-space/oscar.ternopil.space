import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { ImageComponent } from '../../components/image/image.component';
import { ExhibitService } from '../../feature/exhibit/exhibit.service';

@Component({
	imports: [ImageComponent, TranslateDirective],
	templateUrl: './gallery.component.html',
	styleUrl: './gallery.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
	private readonly _exhibitService = inject(ExhibitService);

	protected readonly exhibits = this._exhibitService.exhibits;
	protected readonly isLoading = this._exhibitService.isLoading;
}
