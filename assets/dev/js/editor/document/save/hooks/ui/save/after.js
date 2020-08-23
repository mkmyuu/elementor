import HookUIAfter from 'elementor-api/modules/hooks/ui/after';

export class FooterSaverAfterSave extends HookUIAfter {
	getCommand() {
		return 'document/save/save';
	}

	getId() {
		return 'footer-saver-after-save';
	}

	getConditions() {
		return elementor.config.document.urls.have_a_look;
	}

	apply( args, result ) {
		const { status } = args,
			{ data } = result,
			{ footerSaver } = $e.components.get( 'document/save' );

		NProgress.done();

		footerSaver.ui.buttonPublish.removeClass( 'elementor-button-state' );
		footerSaver.ui.lastEditedWrapper.removeClass( 'elementor-state-active' );

		footerSaver.refreshWpPreview();
		footerSaver.setLastEdited( data.config.document.last_edited );

		if ( result.statusChanged ) {
			this.onPageStatusChange( status );
		}
	}

	onPageStatusChange( newStatus ) {
		if ( 'publish' === newStatus ) {
			const buttons = [];

			buttons.push( {
				name: 'view_page',
				text: elementor.translate( 'have_a_look' ),
				callback() {
					open( elementor.config.document.urls.have_a_look );
				},
			} );

			elementor.notifications.showToast( {
				message: elementor.config.document.panel.messages.publish_notification,
				buttons,
			} );
		}
	}
}

export default FooterSaverAfterSave;
