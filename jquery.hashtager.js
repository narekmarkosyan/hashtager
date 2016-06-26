(function( $ ) {

    var wordPattern = /\B#([a-zA-Z\u0400-\u04ff][a-zA-Z\d\u0400-\u04ff]*)/ig;
    var numPattern = /\B#(\d\d*)/ig;
    var totalPattern = /\B#([\da-zA-Z\u0400-\u04ff][\da-zA-Z\d\u0400-\u04ff]*)/ig;

    $.fn.hashtager = function(options) {

        // Defaults
        var settings = $.extend({
            'template': '<strong class="{CLASS}">#{ANCHOR}</strong>',
            'numericTemplate': '',
            'class': 'hashtager'
        }, options );

        var $textNodes = this.contents()
            .filter(function(){
                return this.nodeType === Node.TEXT_NODE;
            });

        $textNodes.each(function(){
            var $node = $(this);
            var html = $node.text();

            var template = prepareTemplate(settings.template);

            if(settings.numericTemplate){
                var numericTemplate = prepareTemplate(settings.numericTemplate);

                html = html.replace(wordPattern, template).replace(/\s*$/, "");
                html = html.replace(numPattern, numericTemplate).replace(/\s*$/, "");
            }
            else{
                html = html.replace(totalPattern, template).replace(/\s*$/, "");
            }

            $node.replaceWith(html);
        });

        function prepareTemplate(template){
            template = template.replace(/\{CLASS\}/g, settings.class);
            template = template.replace(/\{ANCHOR\}/g, '\$1');

            return template;
        }

        return this;
    };

    String.prototype.hashtager = function(options){
        var matches = [];
        // Defaults
        var settings = $.extend({
            'type': 'total', // word, num, total
            'withSign': false
        }, options);

        var pattern = '';
        switch (settings.type){
            case 'num':
                pattern = numPattern;
                break;
            case 'word':
                pattern = wordPattern;
                break;
            default:
                pattern = totalPattern;
        }

        while ((match = pattern.exec(this)) !== null) {
            matches.push(settings.withSign ? match[0] : match[1])
        }

        return matches;
    };

}( jQuery ));